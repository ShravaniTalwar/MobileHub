package com.mobilehub;

import com.mobilehub.dto.CouponDTO;
import com.mobilehub.dto.ValidateCouponDTO;
import com.mobilehub.entity.Coupon;
import com.mobilehub.repository.CouponRepository;
import com.mobilehub.service.impl.CouponServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CouponServiceTest {

    @Mock
    private CouponRepository couponRepository;

    @InjectMocks
    private CouponServiceImpl couponService;

    private Coupon percentageCoupon;
    private Coupon fixedCoupon;

    @BeforeEach
    void setUp() {
        percentageCoupon = new Coupon(
                "WELCOME10",
                Coupon.DiscountType.PERCENTAGE,
                new BigDecimal("10.00"),
                new BigDecimal("1000.00"),
                new BigDecimal("500.00"),
                LocalDate.now().plusMonths(1)
        );

        fixedCoupon = new Coupon(
                "FLAT500",
                Coupon.DiscountType.FIXED,
                new BigDecimal("500.00"),
                new BigDecimal("2000.00"),
                null,
                LocalDate.now().plusMonths(1)
        );
    }

    @Test
    void testValidateCoupon_ValidPercentage() {
        when(couponRepository.findByCodeIgnoreCase("WELCOME10")).thenReturn(Optional.of(percentageCoupon));

        ValidateCouponDTO result = couponService.validateCoupon("WELCOME10", new BigDecimal("2000.00"));

        assertTrue(result.isValid());
        assertEquals(new BigDecimal("200.00"), result.getDiscountAmount());
    }

    @Test
    void testValidateCoupon_BelowMinimumAmount() {
        when(couponRepository.findByCodeIgnoreCase("WELCOME10")).thenReturn(Optional.of(percentageCoupon));

        ValidateCouponDTO result = couponService.validateCoupon("WELCOME10", new BigDecimal("500.00"));

        assertFalse(result.isValid());
        assertEquals(BigDecimal.ZERO, result.getDiscountAmount());
    }

    @Test
    void testValidateCoupon_InvalidCode() {
        when(couponRepository.findByCodeIgnoreCase("INVALID")).thenReturn(Optional.empty());

        ValidateCouponDTO result = couponService.validateCoupon("INVALID", new BigDecimal("2000.00"));

        assertFalse(result.isValid());
    }

    @Test
    void testValidateCoupon_FixedDiscount() {
        when(couponRepository.findByCodeIgnoreCase("FLAT500")).thenReturn(Optional.of(fixedCoupon));

        ValidateCouponDTO result = couponService.validateCoupon("FLAT500", new BigDecimal("3000.00"));

        assertTrue(result.isValid());
        assertEquals(new BigDecimal("500.00"), result.getDiscountAmount());
    }
}
