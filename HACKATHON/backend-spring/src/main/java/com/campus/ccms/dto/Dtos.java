package com.campus.ccms.dto;

import com.campus.ccms.entity.Enums;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

public class Dtos {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LoginRequest {
        @NotBlank(message = "Email is required")
        private String email;

        @NotBlank(message = "Password is required")
        private String password;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AuthResponse {
        private String token;
        private Long userId;
        private String name;
        private String email;
        private String role;
        private String collegeId;
        private String department;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ComplaintCreateRequest {
        @NotBlank(message = "Title is required")
        @Size(min = 5, max = 200, message = "Title must be between 5 and 200 characters")
        private String title;

        @NotBlank(message = "Description is required")
        @Size(min = 10, message = "Description must provide sufficient detail")
        private String description;

        @NotBlank(message = "Campus location is required")
        private String location;

        @NotNull(message = "Category ID is required")
        private Integer categoryId;

        private Enums.Priority priority;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AssignRequest {
        @NotNull(message = "Staff ID is required")
        private Long staffUserId;

        private String instructions;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ResolveRequest {
        @NotBlank(message = "Action remarks are required")
        private String remarks;

        private String sparePartsUsed;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FeedbackRequest {
        @NotNull(message = "Rating must be between 1 and 5")
        private Integer rating;

        private String comments;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReopenRequest {
        @NotBlank(message = "Reason for reopening is required")
        private String reason;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ComplaintDto {
        private Long id;
        private String trackingNumber;
        private String title;
        private String description;
        private String location;
        private String category;
        private Integer categoryId;
        private String priority;
        private String aiSuggestedPriority;
        private Double aiConfidenceScore;
        private String status;
        private Long complainantId;
        private String complainantName;
        private String complainantEmail;
        private Long assignedToId;
        private String assignedToName;
        private String resolutionRemarks;
        private String createdAt;
        private String updatedAt;
        private List<HistoryDto> history;
        private FeedbackDto feedback;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class HistoryDto {
        private Long id;
        private String timestamp;
        private String from;
        private String to;
        private String actor;
        private String remarks;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class FeedbackDto {
        private Integer rating;
        private String comments;
        private String submittedAt;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AnalyticsSummaryDto {
        private Long totalComplaints;
        private Long activePending;
        private Long resolvedComplaints;
        private Double resolutionRatePct;
        private Long criticalHazards;
        private Double avgResolutionHours;
    }
}
