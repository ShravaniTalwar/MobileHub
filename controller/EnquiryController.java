package com.mobilehub.controller;

import com.mobilehub.dto.EnquiryDTO;
import com.mobilehub.dto.PageResponse;
import com.mobilehub.service.EnquiryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/enquiries")
@Tag(name = "Enquiries", description = "Customer contact and support messages")
public class EnquiryController {

    private final EnquiryService enquiryService;

    public EnquiryController(EnquiryService enquiryService) {
        this.enquiryService = enquiryService;
    }

    @PostMapping
    @Operation(summary = "Submit a contact enquiry")
    public ResponseEntity<EnquiryDTO> submitEnquiry(@Valid @RequestBody EnquiryDTO dto) {
        return new ResponseEntity<>(enquiryService.submitEnquiry(dto), HttpStatus.CREATED);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all customer enquiries (Admin only)")
    public ResponseEntity<PageResponse<EnquiryDTO>> getAllEnquiries(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {
        return ResponseEntity.ok(enquiryService.getAllEnquiries(page, size));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update enquiry status (Admin only)")
    public ResponseEntity<EnquiryDTO> updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        return ResponseEntity.ok(enquiryService.updateEnquiryStatus(id, status));
    }
}
