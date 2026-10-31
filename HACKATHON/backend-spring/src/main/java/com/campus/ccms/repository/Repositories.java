package com.campus.ccms.repository;

import com.campus.ccms.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

public class Repositories {

    @Repository
    public interface UserRepository extends JpaRepository<User, Long> {
        Optional<User> findByEmail(String email);
        Optional<User> findByCollegeId(String collegeId);
        List<User> findByDepartmentId(Integer departmentId);
        List<User> findByRoleName(String roleName);
    }

    @Repository
    public interface DepartmentRepository extends JpaRepository<Department, Integer> {
        Optional<Department> findByCode(String code);
    }

    @Repository
    public interface CategoryRepository extends JpaRepository<Category, Integer> {
        Optional<Category> findByName(String name);
    }

    @Repository
    public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
        Optional<Complaint> findByTrackingNumber(String trackingNumber);
        List<Complaint> findByComplainantIdOrderByCreatedAtDesc(Long complainantId);
        List<Complaint> findByAssignedToIdOrderByCreatedAtDesc(Long assignedToId);
        List<Complaint> findByStatus(Enums.ComplaintStatus status);
        List<Complaint> findByPriority(Enums.Priority priority);

        @Query("SELECT COUNT(c) FROM Complaint c WHERE c.status IN ('RESOLVED', 'CLOSED')")
        Long countResolvedOrClosed();

        @Query("SELECT c.category.name, COUNT(c) FROM Complaint c GROUP BY c.category.name")
        List<Object[]> countComplaintsByCategory();

        @Query("SELECT c.priority, COUNT(c) FROM Complaint c GROUP BY c.priority")
        List<Object[]> countComplaintsByPriority();
    }

    @Repository
    public interface StatusHistoryRepository extends JpaRepository<StatusHistory, Long> {
        List<StatusHistory> findByComplaintIdOrderByCreatedAtAsc(Long complaintId);
    }

    @Repository
    public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
        Optional<Feedback> findByComplaintId(Long complaintId);
    }
}
