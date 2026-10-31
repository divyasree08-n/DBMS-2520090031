package com.campus.ccms.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "roles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "role_id")
    private Integer id;

    @Column(nullable = false, unique = true, length = 50)
    private String name; // ROLE_STUDENT, ROLE_ADMIN, ROLE_STAFF

    @Column(nullable = false)
    private String description;
}
