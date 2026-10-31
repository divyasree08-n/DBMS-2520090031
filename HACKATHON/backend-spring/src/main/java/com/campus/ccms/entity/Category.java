package com.campus.ccms.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "categories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id")
    private Integer id;

    @Column(nullable = false, unique = true, length = 50)
    private String name;

    @Column(nullable = false, unique = true, length = 20)
    private String code;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "default_department_id", nullable = false)
    private Department defaultDepartment;

    @Column(name = "default_sla_hours", nullable = false)
    private Integer defaultSlaHours;

    private String description;

    @Builder.Default
    @Column(name = "is_active")
    private Boolean isActive = true;
}
