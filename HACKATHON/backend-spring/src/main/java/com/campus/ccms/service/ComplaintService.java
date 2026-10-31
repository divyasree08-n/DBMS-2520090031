package com.campus.ccms.service;

import com.campus.ccms.dto.Dtos.*;
import com.campus.ccms.entity.*;
import com.campus.ccms.repository.Repositories.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final StatusHistoryRepository statusHistoryRepository;
    private final FeedbackRepository feedbackRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${app.ai-service.url:http://localhost:8001}")
    private String aiServiceUrl;

    private static final DateTimeFormatter IST_FORMATTER = DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a 'IST'");

    @Transactional
    public ComplaintDto registerComplaint(ComplaintCreateRequest req, Long complainantUserId) {
        User complainant = userRepository.findById(complainantUserId)
                .orElseThrow(() -> new IllegalArgumentException("Complainant user not found with ID: " + complainantUserId));

        Category category = categoryRepository.findById(req.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Category not found with ID: " + req.getCategoryId()));

        // Call Python AI Microservice for NLP Triage & Priority Recommendation
        Enums.Priority recommendedPriority = req.getPriority() != null ? req.getPriority() : Enums.Priority.MEDIUM;
        Double aiConfidence = 0.85;

        try {
            Map<String, String> aiPayload = Map.of(
                    "title", req.getTitle(),
                    "description", req.getDescription(),
                    "location", req.getLocation()
            );
            Map<?, ?> aiResponse = restTemplate.postForObject(aiServiceUrl + "/api/v1/ml/classify", aiPayload, Map.class);
            if (aiResponse != null) {
                if (aiResponse.containsKey("recommended_priority")) {
                    recommendedPriority = Enums.Priority.valueOf(aiResponse.get("recommended_priority").toString());
                }
                if (aiResponse.containsKey("confidence_score")) {
                    aiConfidence = Double.valueOf(aiResponse.get("confidence_score").toString());
                }
            }
        } catch (Exception ex) {
            log.warn("AI Triage service unreachable at {}. Using rule-based fallback.", aiServiceUrl);
        }

        String trackingNumber = "CCMS-2026-" + (1000 + new Random().nextInt(9000));
        LocalDateTime now = LocalDateTime.now();

        Complaint complaint = Complaint.builder()
                .trackingNumber(trackingNumber)
                .complainant(complainant)
                .category(category)
                .title(req.getTitle())
                .description(req.getDescription())
                .location(req.getLocation())
                .priority(req.getPriority() != null ? req.getPriority() : recommendedPriority)
                .aiSuggestedPriority(recommendedPriority)
                .aiConfidenceScore(aiConfidence)
                .status(Enums.ComplaintStatus.SUBMITTED)
                .expectedResolutionAt(now.plusHours(category.getDefaultSlaHours()))
                .build();

        Complaint saved = complaintRepository.save(complaint);

        // Record Initial Status History in IST
        StatusHistory initialHistory = StatusHistory.builder()
                .complaint(saved)
                .fromStatus(null)
                .toStatus(Enums.ComplaintStatus.SUBMITTED.name())
                .changedBy(complainant)
                .remarks("Complaint registered online via portal with AI priority recommendation: " + saved.getPriority())
                .build();

        statusHistoryRepository.save(initialHistory);

        return mapToDto(saved);
    }

    @Transactional
    public ComplaintDto assignStaff(Long complaintId, Long staffUserId, String instructions, Long adminUserId) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new IllegalArgumentException("Complaint not found with ID: " + complaintId));

        User staff = userRepository.findById(staffUserId)
                .orElseThrow(() -> new IllegalArgumentException("Staff not found with ID: " + staffUserId));

        User admin = userRepository.findById(adminUserId)
                .orElseThrow(() -> new IllegalArgumentException("Admin not found with ID: " + adminUserId));

        String prevStatus = complaint.getStatus().name();
        complaint.setAssignedTo(staff);
        complaint.setStatus(Enums.ComplaintStatus.ASSIGNED);

        statusHistoryRepository.save(StatusHistory.builder()
                .complaint(complaint)
                .fromStatus(prevStatus)
                .toStatus(Enums.ComplaintStatus.ASSIGNED.name())
                .changedBy(admin)
                .remarks("Assigned to " + staff.getFullName() + ". Notes: " + (instructions != null ? instructions : "Attend to campus issue."))
                .build());

        return mapToDto(complaintRepository.save(complaint));
    }

    @Transactional
    public ComplaintDto setInProgress(Long complaintId, Long staffUserId) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new IllegalArgumentException("Complaint not found"));

        User staff = userRepository.findById(staffUserId)
                .orElseThrow(() -> new IllegalArgumentException("Staff user not found"));

        complaint.setStatus(Enums.ComplaintStatus.IN_PROGRESS);

        statusHistoryRepository.save(StatusHistory.builder()
                .complaint(complaint)
                .fromStatus(Enums.ComplaintStatus.ASSIGNED.name())
                .toStatus(Enums.ComplaintStatus.IN_PROGRESS.name())
                .changedBy(staff)
                .remarks("Staff acknowledged work order and commenced on-site diagnosis.")
                .build());

        return mapToDto(complaintRepository.save(complaint));
    }

    @Transactional
    public ComplaintDto resolveComplaint(Long complaintId, String remarks, Long staffUserId) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new IllegalArgumentException("Complaint not found"));

        User staff = userRepository.findById(staffUserId)
                .orElseThrow(() -> new IllegalArgumentException("Staff not found"));

        complaint.setStatus(Enums.ComplaintStatus.RESOLVED);
        complaint.setResolutionRemarks(remarks);
        complaint.setResolvedAt(LocalDateTime.now());

        statusHistoryRepository.save(StatusHistory.builder()
                .complaint(complaint)
                .fromStatus(Enums.ComplaintStatus.IN_PROGRESS.name())
                .toStatus(Enums.ComplaintStatus.RESOLVED.name())
                .changedBy(staff)
                .remarks("Repair completed by technician: " + remarks)
                .build());

        return mapToDto(complaintRepository.save(complaint));
    }

    @Transactional
    public ComplaintDto submitFeedback(Long complaintId, Integer rating, String comments, Long complainantId) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new IllegalArgumentException("Complaint not found"));

        User complainant = userRepository.findById(complainantId)
                .orElseThrow(() -> new IllegalArgumentException("Complainant not found"));

        Feedback feedback = Feedback.builder()
                .complaint(complaint)
                .complainant(complainant)
                .rating(rating)
                .comments(comments)
                .build();

        feedbackRepository.save(feedback);
        complaint.setStatus(Enums.ComplaintStatus.CLOSED);

        statusHistoryRepository.save(StatusHistory.builder()
                .complaint(complaint)
                .fromStatus(Enums.ComplaintStatus.RESOLVED.name())
                .toStatus(Enums.ComplaintStatus.CLOSED.name())
                .changedBy(complainant)
                .remarks("Complainant verified fix with rating " + rating + "/5 stars. Complaint closed.")
                .build());

        return mapToDto(complaintRepository.save(complaint));
    }

    @Transactional
    public ComplaintDto reopenComplaint(Long complaintId, String reason, Long complainantId) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new IllegalArgumentException("Complaint not found"));

        User complainant = userRepository.findById(complainantId)
                .orElseThrow(() -> new IllegalArgumentException("Complainant not found"));

        complaint.setStatus(Enums.ComplaintStatus.REOPENED);
        complaint.setPriority(Enums.Priority.CRITICAL); // Escalate urgency

        statusHistoryRepository.save(StatusHistory.builder()
                .complaint(complaint)
                .fromStatus(Enums.ComplaintStatus.RESOLVED.name())
                .toStatus(Enums.ComplaintStatus.REOPENED.name())
                .changedBy(complainant)
                .remarks("Issue unresolved by student: " + reason + " - Escalated to CRITICAL priority.")
                .build());

        return mapToDto(complaintRepository.save(complaint));
    }

    @Transactional(readOnly = true)
    public List<ComplaintDto> getAllComplaints() {
        return complaintRepository.findAll().stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ComplaintDto getByTrackingNumber(String trackingNumber) {
        return complaintRepository.findByTrackingNumber(trackingNumber)
                .map(this::mapToDto)
                .orElseThrow(() -> new IllegalArgumentException("Complaint not found with tracking number: " + trackingNumber));
    }

    @Transactional(readOnly = true)
    public List<ComplaintDto> getStaffTasks(Long staffId) {
        return complaintRepository.findByAssignedToIdOrderByCreatedAtDesc(staffId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private ComplaintDto mapToDto(Complaint c) {
        List<HistoryDto> historyDtos = c.getHistory().stream()
                .map(h -> HistoryDto.builder()
                        .id(h.getId())
                        .timestamp(h.getCreatedAt() != null ? h.getCreatedAt().format(IST_FORMATTER) : "N/A")
                        .from(h.getFromStatus())
                        .to(h.getToStatus())
                        .actor(h.getChangedBy() != null ? h.getChangedBy().getFullName() : "System")
                        .remarks(h.getRemarks())
                        .build())
                .collect(Collectors.toList());

        FeedbackDto feedbackDto = null;
        if (c.getFeedback() != null) {
            feedbackDto = FeedbackDto.builder()
                    .rating(c.getFeedback().getRating())
                    .comments(c.getFeedback().getComments())
                    .submittedAt(c.getFeedback().getCreatedAt() != null ? c.getFeedback().getCreatedAt().format(IST_FORMATTER) : "")
                    .build();
        }

        return ComplaintDto.builder()
                .id(c.getId())
                .trackingNumber(c.getTrackingNumber())
                .title(c.getTitle())
                .description(c.getDescription())
                .location(c.getLocation())
                .category(c.getCategory() != null ? c.getCategory().getName() : "")
                .categoryId(c.getCategory() != null ? c.getCategory().getId() : 1)
                .priority(c.getPriority().name())
                .aiSuggestedPriority(c.getAiSuggestedPriority() != null ? c.getAiSuggestedPriority().name() : c.getPriority().name())
                .aiConfidenceScore(c.getAiConfidenceScore())
                .status(c.getStatus().name())
                .complainantId(c.getComplainant().getId())
                .complainantName(c.getComplainant().getFullName())
                .complainantEmail(c.getComplainant().getEmail())
                .assignedToId(c.getAssignedTo() != null ? c.getAssignedTo().getId() : null)
                .assignedToName(c.getAssignedTo() != null ? c.getAssignedTo().getFullName() : null)
                .resolutionRemarks(c.getResolutionRemarks())
                .createdAt(c.getCreatedAt() != null ? c.getCreatedAt().format(IST_FORMATTER) : "")
                .updatedAt(c.getUpdatedAt() != null ? c.getUpdatedAt().format(IST_FORMATTER) : "")
                .history(historyDtos)
                .feedback(feedbackDto)
                .build();
    }
}
