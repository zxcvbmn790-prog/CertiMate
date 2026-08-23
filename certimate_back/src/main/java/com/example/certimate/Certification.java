package com.example.certimate;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "`CERTIFICATION`")
@Getter
@NoArgsConstructor
public class Certification {

    @Id
    private Long certId;

    @Column(name = "cert_name", nullable = false)
    private String certName;

    private String difficulty;

    private String agency;

    private Integer views;
}
