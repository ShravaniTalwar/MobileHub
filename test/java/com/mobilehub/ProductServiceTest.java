package com.mobilehub;

import com.mobilehub.dto.ProductDTO;
import com.mobilehub.entity.Brand;
import com.mobilehub.entity.Category;
import com.mobilehub.entity.Product;
import com.mobilehub.exception.ResourceNotFoundException;
import com.mobilehub.repository.*;
import com.mobilehub.service.impl.ProductServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;
    @Mock
    private CategoryRepository categoryRepository;
    @Mock
    private BrandRepository brandRepository;
    @Mock
    private InventoryRepository inventoryRepository;
    @Mock
    private ProductImageRepository productImageRepository;

    @InjectMocks
    private ProductServiceImpl productService;

    private Product product;

    @BeforeEach
    void setUp() {
        Category category = new Category("Smartphones", "smartphones", "Description", "img.jpg", 1);
        category.setId(1L);
        Brand brand = new Brand("Apple", "apple", "logo.jpg", "Description");
        brand.setId(1L);

        product = new Product();
        product.setId(1L);
        product.setName("iPhone 16");
        product.setSlug("iphone-16");
        product.setSku("APL-IP16-128");
        product.setCategory(category);
        product.setBrand(brand);
        product.setPrice(new BigDecimal("79900.00"));
        product.setOriginalPrice(new BigDecimal("84900.00"));
        product.setStockQuantity(20);
        product.setRating(4.8);
    }

    @Test
    void testGetProductById_Success() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        ProductDTO dto = productService.getProductById(1L);

        assertNotNull(dto);
        assertEquals("iPhone 16", dto.getName());
        assertEquals("APL-IP16-128", dto.getSku());
    }

    @Test
    void testGetProductById_NotFound() {
        when(productRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> productService.getProductById(99L));
    }
}
