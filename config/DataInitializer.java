package com.mobilehub.config;

import com.mobilehub.entity.*;
import com.mobilehub.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;
    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;
    private final InventoryRepository inventoryRepository;
    private final CouponRepository couponRepository;
    private final BannerRepository bannerRepository;
    private final ReviewRepository reviewRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final PaymentRepository paymentRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(RoleRepository roleRepository,
                           UserRepository userRepository,
                           CategoryRepository categoryRepository,
                           BrandRepository brandRepository,
                           ProductRepository productRepository,
                           ProductImageRepository productImageRepository,
                           InventoryRepository inventoryRepository,
                           CouponRepository couponRepository,
                           BannerRepository bannerRepository,
                           ReviewRepository reviewRepository,
                           OrderRepository orderRepository,
                           OrderItemRepository orderItemRepository,
                           PaymentRepository paymentRepository,
                           PasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.brandRepository = brandRepository;
        this.productRepository = productRepository;
        this.productImageRepository = productImageRepository;
        this.inventoryRepository = inventoryRepository;
        this.couponRepository = couponRepository;
        this.bannerRepository = bannerRepository;
        this.reviewRepository = reviewRepository;
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.paymentRepository = paymentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (roleRepository.count() > 0 && productRepository.count() > 0) {
            logger.info("Database already seeded. Skipping initial data load.");
            return;
        }

        logger.info("Starting database initialization with realistic Indian mobile shop dataset...");

        // 1. ROLES
        Role roleCustomer = roleRepository.save(new Role("ROLE_CUSTOMER"));
        Role roleAdmin = roleRepository.save(new Role("ROLE_ADMIN"));

        // 2. USERS
        User admin = new User();
        admin.setName("MobileHub Admin");
        admin.setEmail("admin@mobilehub.com");
        admin.setPhone("9876543210");
        admin.setPassword(passwordEncoder.encode("Admin@123"));
        admin.setActive(true);
        admin.setRoles(Set.of(roleAdmin, roleCustomer));
        admin = userRepository.save(admin);

        User customer = new User();
        customer.setName("Rahul Sharma");
        customer.setEmail("customer@mobilehub.com");
        customer.setPhone("9812345678");
        customer.setPassword(passwordEncoder.encode("Customer@123"));
        customer.setActive(true);
        customer.setRoles(Set.of(roleCustomer));
        customer = userRepository.save(customer);

        // 3. BRANDS (10 Brands)
        Brand apple = brandRepository.save(new Brand("Apple", "apple", "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=300", "Pioneering premium smartphones and consumer tech."));
        Brand samsung = brandRepository.save(new Brand("Samsung", "samsung", "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=300", "World leader in AMOLED display innovation and flagship mobile hardware."));
        Brand oneplus = brandRepository.save(new Brand("OnePlus", "oneplus", "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=300", "Never Settle - Fast performance and Hasselblad camera experience."));
        Brand google = brandRepository.save(new Brand("Google", "google", "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=300", "Powered by Google AI and industry-leading computational photography."));
        Brand xiaomi = brandRepository.save(new Brand("Xiaomi", "xiaomi", "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300", "Innovation for everyone with Leica optics and top-tier specifications."));
        Brand vivo = brandRepository.save(new Brand("Vivo", "vivo", "https://images.unsplash.com/photo-1567581935884-3349723552ca?w=300", "ZEISS portrait camera masterclass and sleek industrial craftsmanship."));
        Brand oppo = brandRepository.save(new Brand("Oppo", "oppo", "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=300", "Hasselblad mobile imaging and ultra-fast VOOC flash charging."));
        Brand realme = brandRepository.save(new Brand("Realme", "realme", "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=300", "Dare to Leap - Flagship performance designed for modern youths."));
        Brand motorola = brandRepository.save(new Brand("Motorola", "motorola", "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=300", "Clean Hello UI, Pantone certified colors and edge-to-edge curves."));
        Brand nothing = brandRepository.save(new Brand("Nothing", "nothing", "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300", "Distinctive transparent Glyph interface with clean, bloatware-free OS."));

        // 4. CATEGORIES (8 Categories)
        Category catSmartphones = categoryRepository.save(new Category("Smartphones", "smartphones", "All touch and smart mobile devices.", "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600", 1));
        Category catFlagship = categoryRepository.save(new Category("Flagship Phones", "flagship-phones", "Top-tier premium smartphones with cutting-edge features.", "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600", 2));
        Category catBudget = categoryRepository.save(new Category("Budget Phones", "budget-phones", "Best value-for-money smartphones under ₹25,000.", "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600", 3));
        Category cat5G = categoryRepository.save(new Category("5G Phones", "5g-phones", "Ultra-fast next generation 5G enabled smartphones.", "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=600", 4));
        Category catFoldable = categoryRepository.save(new Category("Foldable Phones", "foldable-phones", "Futuristic folding and flipping screen smartphones.", "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=600", 5));
        Category catTablets = categoryRepository.save(new Category("Tablets", "tablets", "Productivity and multimedia tablets.", "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600", 6));
        Category catSmartwatches = categoryRepository.save(new Category("Smartwatches", "smartwatches", "Fitness and smart wristwear wearables.", "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600", 7));
        Category catAccessories = categoryRepository.save(new Category("Audio & Accessories", "audio-accessories", "Premium wireless earbuds, fast chargers, cables, and cases.", "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600", 8));

        // 5. PRODUCTS HELPER
        List<Product> products = new ArrayList<>();

        // Helper lambda to construct product
        java.util.function.Consumer<Product> addP = p -> {
            Product saved = productRepository.save(p);
            // primary image
            productImageRepository.save(new ProductImage(saved, saved.getMainImageUrl(), 1, true));
            // inventory
            inventoryRepository.save(new Inventory(saved, saved.getStockQuantity(), 5));
            products.add(saved);
        };

        // --- 30 SMARTPHONES ---
        // 1. Apple iPhone 16 Pro Max
        Product p1 = new Product();
        p1.setName("Apple iPhone 16 Pro Max (Desert Titanium, 256GB)");
        p1.setSlug("apple-iphone-16-pro-max-256gb");
        p1.setSku("APL-IP16PM-256");
        p1.setDescription("iPhone 16 Pro Max forged in Grade 5 titanium with Camera Control, 4K 120 fps Dolby Vision, and the powerhouse A18 Pro chip.");
        p1.setBrand(apple); p1.setCategory(catFlagship);
        p1.setPrice(new BigDecimal("144900.00")); p1.setOriginalPrice(new BigDecimal("154900.00"));
        p1.setDiscountPercent(6); p1.setStockQuantity(18); p1.setRating(4.9); p1.setReviewCount(342);
        p1.setIsFeatured(true); p1.setIsTrending(true); p1.setIsLatest(true); p1.setIs5g(true);
        p1.setRam("8GB"); p1.setStorage("256GB"); p1.setColor("Desert Titanium");
        p1.setBattery("4685 mAh"); p1.setDisplay("6.9-inch Super Retina XDR OLED 120Hz ProMotion");
        p1.setProcessor("Apple A18 Pro (3nm)"); p1.setCamera("48MP Fusion + 48MP Ultra Wide + 12MP 5x Telephoto");
        p1.setOs("iOS 18"); p1.setWarranty("1 Year Apple India Warranty");
        p1.setMainImageUrl("https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800");
        addP.accept(p1);

        // 2. Apple iPhone 16
        Product p2 = new Product();
        p2.setName("Apple iPhone 16 (Ultramarine, 128GB)");
        p2.setSlug("apple-iphone-16-128gb");
        p2.setSku("APL-IP16-128");
        p2.setDescription("Meet iPhone 16 with Camera Control, 48MP Fusion camera with 2x Telephoto, 5 vibrant colors, and the next-gen A18 chip.");
        p2.setBrand(apple); p2.setCategory(catSmartphones);
        p2.setPrice(new BigDecimal("74900.00")); p2.setOriginalPrice(new BigDecimal("79900.00"));
        p2.setDiscountPercent(6); p2.setStockQuantity(25); p2.setRating(4.8); p2.setReviewCount(218);
        p2.setIsFeatured(true); p2.setIsTrending(true); p2.setIsLatest(true); p2.setIs5g(true);
        p2.setRam("8GB"); p2.setStorage("128GB"); p2.setColor("Ultramarine");
        p2.setBattery("3561 mAh"); p2.setDisplay("6.1-inch Super Retina XDR OLED");
        p2.setProcessor("Apple A18"); p2.setCamera("48MP Fusion + 12MP Ultra Wide");
        p2.setOs("iOS 18"); p2.setWarranty("1 Year Apple India Warranty");
        p2.setMainImageUrl("https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800");
        addP.accept(p2);

        // 3. Apple iPhone 15
        Product p3 = new Product();
        p3.setName("Apple iPhone 15 (Black, 128GB)");
        p3.setSlug("apple-iphone-15-128gb");
        p3.setSku("APL-IP15-128");
        p3.setDescription("Dynamic Island comes to iPhone 15. Equipped with 48MP Main camera, USB-C connectivity, and durable color-infused glass.");
        p3.setBrand(apple); p3.setCategory(catSmartphones);
        p3.setPrice(new BigDecimal("59900.00")); p3.setOriginalPrice(new BigDecimal("69900.00"));
        p3.setDiscountPercent(14); p3.setStockQuantity(30); p3.setRating(4.7); p3.setReviewCount(840);
        p3.setIsFeatured(false); p3.setIsTrending(true); p3.setIsLatest(false); p3.setIs5g(true);
        p3.setRam("6GB"); p3.setStorage("128GB"); p3.setColor("Black");
        p3.setBattery("3349 mAh"); p3.setDisplay("6.1-inch Super Retina XDR OLED");
        p3.setProcessor("Apple A16 Bionic"); p3.setCamera("48MP Main + 12MP Ultra Wide");
        p3.setOs("iOS 17 (Upgradable to iOS 18)"); p3.setWarranty("1 Year Apple India Warranty");
        p3.setMainImageUrl("https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800");
        addP.accept(p3);

        // 4. Samsung Galaxy S25 Ultra
        Product p4 = new Product();
        p4.setName("Samsung Galaxy S25 Ultra 5G (Titanium Gray, 512GB)");
        p4.setSlug("samsung-galaxy-s25-ultra-512gb");
        p4.setSku("SAM-S25U-512");
        p4.setDescription("The ultimate Galaxy with Galaxy AI, titanium frame, built-in S Pen, 200MP Quad Telephoto camera system, and Snapdragon 8 Elite.");
        p4.setBrand(samsung); p4.setCategory(catFlagship);
        p4.setPrice(new BigDecimal("139999.00")); p4.setOriginalPrice(new BigDecimal("149999.00"));
        p4.setDiscountPercent(7); p4.setStockQuantity(14); p4.setRating(4.9); p4.setReviewCount(165);
        p4.setIsFeatured(true); p4.setIsTrending(true); p4.setIsLatest(true); p4.setIs5g(true);
        p4.setRam("12GB"); p4.setStorage("512GB"); p4.setColor("Titanium Gray");
        p4.setBattery("5000 mAh 45W Fast Charging"); p4.setDisplay("6.8-inch Dynamic AMOLED 2X 120Hz Anti-Reflective");
        p4.setProcessor("Qualcomm Snapdragon 8 Elite for Galaxy"); p4.setCamera("200MP Main + 50MP 5x Tele + 50MP Ultra Wide + 10MP 3x Tele");
        p4.setOs("Android 15, One UI 7"); p4.setWarranty("1 Year Comprehensive Manufacturer Warranty");
        p4.setMainImageUrl("https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800");
        addP.accept(p4);

        // 5. Samsung Galaxy S24 FE 5G
        Product p5 = new Product();
        p5.setName("Samsung Galaxy S24 FE 5G (Blue, 256GB)");
        p5.setSlug("samsung-galaxy-s24-fe-256gb");
        p5.setSku("SAM-S24FE-256");
        p5.setDescription("Full flagship Galaxy AI suite with Photo Assist, Circle to Search, vivid 6.7\" Dynamic AMOLED 2X screen, and Exynos 2400e.");
        p5.setBrand(samsung); p5.setCategory(catSmartphones);
        p5.setPrice(new BigDecimal("59999.00")); p5.setOriginalPrice(new BigDecimal("65999.00"));
        p5.setDiscountPercent(9); p5.setStockQuantity(22); p5.setRating(4.6); p5.setReviewCount(94);
        p5.setIsFeatured(false); p5.setIsTrending(true); p5.setIsLatest(true); p5.setIs5g(true);
        p5.setRam("8GB"); p5.setStorage("256GB"); p5.setColor("Blue");
        p5.setBattery("4700 mAh"); p5.setDisplay("6.7-inch Dynamic AMOLED 2X 120Hz");
        p5.setProcessor("Samsung Exynos 2400e"); p5.setCamera("50MP OIS + 12MP UW + 8MP 3x Tele");
        p5.setOs("Android 14 (7 Years OS Updates)"); p5.setWarranty("1 Year Brand Warranty");
        p5.setMainImageUrl("https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800");
        addP.accept(p5);

        // 6. Samsung Galaxy Z Fold 6
        Product p6 = new Product();
        p6.setName("Samsung Galaxy Z Fold 6 5G (Silver Shadow, 256GB)");
        p6.setSlug("samsung-galaxy-z-fold-6-256gb");
        p6.setSku("SAM-ZFOLD6-256");
        p6.setDescription("Slimmer, lighter, and packed with Galaxy AI. Large 7.6\" folding immersive display designed for high-gear multitasking.");
        p6.setBrand(samsung); p6.setCategory(catFoldable);
        p6.setPrice(new BigDecimal("164999.00")); p6.setOriginalPrice(new BigDecimal("174999.00"));
        p6.setDiscountPercent(6); p6.setStockQuantity(8); p6.setRating(4.8); p6.setReviewCount(76);
        p6.setIsFeatured(true); p6.setIsTrending(false); p6.setIsLatest(true); p6.setIs5g(true);
        p6.setRam("12GB"); p6.setStorage("256GB"); p6.setColor("Silver Shadow");
        p6.setBattery("4400 mAh Dual Battery"); p6.setDisplay("7.6\" QXGA+ Dynamic AMOLED 2X Foldable + 6.3\" Cover");
        p6.setProcessor("Snapdragon 8 Gen 3 for Galaxy"); p6.setCamera("50MP OIS + 12MP UW + 10MP 3x Tele");
        p6.setOs("Android 14, One UI 6.1.1"); p6.setWarranty("1 Year Manufacturer Warranty with 1-time screen replacement");
        p6.setMainImageUrl("https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=800");
        addP.accept(p6);

        // 7. OnePlus 13 5G
        Product p7 = new Product();
        p7.setName("OnePlus 13 5G (Midnight Black, 512GB)");
        p7.setSlug("oneplus-13-5g-512gb");
        p7.setSku("OP-13-512");
        p7.setDescription("OnePlus 13 powered by Snapdragon 8 Elite, 6000mAh Glacier battery, 100W SUPERVOOC, and 50MP Sony LYT-808 Hasselblad triple camera.");
        p7.setBrand(oneplus); p7.setCategory(catFlagship);
        p7.setPrice(new BigDecimal("69999.00")); p7.setOriginalPrice(new BigDecimal("74999.00"));
        p7.setDiscountPercent(7); p7.setStockQuantity(20); p7.setRating(4.8); p7.setReviewCount(143);
        p7.setIsFeatured(true); p7.setIsTrending(true); p7.setIsLatest(true); p7.setIs5g(true);
        p7.setRam("16GB"); p7.setStorage("512GB"); p7.setColor("Midnight Black");
        p7.setBattery("6000 mAh 100W Wired + 50W Wireless"); p7.setDisplay("6.82-inch 2K Oriental AMOLED 120Hz LTPO");
        p7.setProcessor("Snapdragon 8 Elite (3nm)"); p7.setCamera("50MP LYT-808 + 50MP Ultra Wide + 50MP Periscope 3x");
        p7.setOs("OxygenOS 15 based on Android 15"); p7.setWarranty("1 Year Brand Warranty");
        p7.setMainImageUrl("https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800");
        addP.accept(p7);

        // 8. OnePlus 12R 5G
        Product p8 = new Product();
        p8.setName("OnePlus 12R 5G (Cool Blue, 256GB)");
        p8.setSlug("oneplus-12r-5g-256gb");
        p8.setSku("OP-12R-256");
        p8.setDescription("Performance powerhouse featuring Snapdragon 8 Gen 2, ultra-smooth 4th Gen LTPO 120Hz display, and massive 5500 mAh battery.");
        p8.setBrand(oneplus); p8.setCategory(cat5G);
        p8.setPrice(new BigDecimal("42999.00")); p8.setOriginalPrice(new BigDecimal("45999.00"));
        p8.setDiscountPercent(7); p8.setStockQuantity(28); p8.setRating(4.7); p8.setReviewCount(520);
        p8.setIsFeatured(false); p8.setIsTrending(true); p8.setIsLatest(false); p8.setIs5g(true);
        p8.setRam("16GB"); p8.setStorage("256GB"); p8.setColor("Cool Blue");
        p8.setBattery("5500 mAh with 100W SUPERVOOC"); p8.setDisplay("6.78-inch ProXDR 1.5K AMOLED 120Hz");
        p8.setProcessor("Snapdragon 8 Gen 2"); p8.setCamera("50MP Sony IMX890 OIS + 8MP UW + 2MP Macro");
        p8.setOs("OxygenOS 14 based on Android 14"); p8.setWarranty("1 Year Brand Warranty");
        p8.setMainImageUrl("https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800");
        addP.accept(p8);

        // 9. OnePlus Nord CE4 5G
        Product p9 = new Product();
        p9.setName("OnePlus Nord CE4 5G (Celadon Marble, 128GB)");
        p9.setSlug("oneplus-nord-ce4-128gb");
        p9.setSku("OP-NCE4-128");
        p9.setDescription("Snapdragon 7 Gen 3 performance, 100W fast charging, 5500 mAh battery, and stunning Celadon Marble finish.");
        p9.setBrand(oneplus); p9.setCategory(catBudget);
        p9.setPrice(new BigDecimal("24999.00")); p9.setOriginalPrice(new BigDecimal("26999.00"));
        p9.setDiscountPercent(7); p9.setStockQuantity(35); p9.setRating(4.5); p9.setReviewCount(610);
        p9.setIsFeatured(false); p9.setIsTrending(false); p9.setIsLatest(false); p9.setIs5g(true);
        p9.setRam("8GB"); p9.setStorage("128GB"); p9.setColor("Celadon Marble");
        p9.setBattery("5500 mAh with 100W SUPERVOOC"); p9.setDisplay("6.7-inch FHD+ AMOLED 120Hz");
        p9.setProcessor("Qualcomm Snapdragon 7 Gen 3"); p9.setCamera("50MP Sony LYT-600 OIS + 8MP UW");
        p9.setOs("OxygenOS 14"); p9.setWarranty("1 Year Brand Warranty");
        p9.setMainImageUrl("https://images.unsplash.com/photo-1567581935884-3349723552ca?w=800");
        addP.accept(p9);

        // 10. Google Pixel 9 Pro XL
        Product p10 = new Product();
        p10.setName("Google Pixel 9 Pro XL 5G (Porcelain, 256GB)");
        p10.setSlug("google-pixel-9-pro-xl-256gb");
        p10.setSku("GGL-P9PXL-256");
        p10.setDescription("Engineered by Google with Tensor G4, Gemini AI integrated, Super Actua display, and world-renowned computational camera optics.");
        p10.setBrand(google); p10.setCategory(catFlagship);
        p10.setPrice(new BigDecimal("124999.00")); p10.setOriginalPrice(new BigDecimal("129999.00"));
        p10.setDiscountPercent(4); p10.setStockQuantity(12); p10.setRating(4.8); p10.setReviewCount(110);
        p10.setIsFeatured(true); p10.setIsTrending(true); p10.setIsLatest(true); p10.setIs5g(true);
        p10.setRam("16GB"); p10.setStorage("256GB"); p10.setColor("Porcelain");
        p10.setBattery("5060 mAh 37W Fast Charging"); p10.setDisplay("6.8-inch Super Actua LTPO OLED 120Hz 3000 nits");
        p10.setProcessor("Google Tensor G4 with Titan M2"); p10.setCamera("50MP Octa PD + 48MP UW + 48MP 5x Tele");
        p10.setOs("Android 15 (7 Years Guaranteed OS Updates)"); p10.setWarranty("1 Year Google India Warranty");
        p10.setMainImageUrl("https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800");
        addP.accept(p10);

        // 11. Google Pixel 8a 5G
        Product p11 = new Product();
        p11.setName("Google Pixel 8a 5G (Aloe, 128GB)");
        p11.setSlug("google-pixel-8a-128gb");
        p11.setSku("GGL-P8A-128");
        p11.setDescription("Delightful AI capabilities with Google Tensor G3, Best Take, Audio Magic Eraser, and 7 years of software support.");
        p11.setBrand(google); p11.setCategory(catSmartphones);
        p11.setPrice(new BigDecimal("49999.00")); p11.setOriginalPrice(new BigDecimal("52999.00"));
        p11.setDiscountPercent(6); p11.setStockQuantity(20); p11.setRating(4.6); p11.setReviewCount(180);
        p11.setIsFeatured(false); p11.setIsTrending(false); p11.setIsLatest(false); p11.setIs5g(true);
        p11.setRam("8GB"); p11.setStorage("128GB"); p11.setColor("Aloe");
        p11.setBattery("4492 mAh"); p11.setDisplay("6.1-inch Actua OLED 120Hz");
        p11.setProcessor("Google Tensor G3"); p11.setCamera("64MP Quad PD + 13MP Ultrawide");
        p11.setOs("Android 14 (7 Years OS Updates)"); p11.setWarranty("1 Year Google India Warranty");
        p11.setMainImageUrl("https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800");
        addP.accept(p11);

        // 12. Xiaomi 14 Ultra 5G
        Product p12 = new Product();
        p12.setName("Xiaomi 14 Ultra 5G (Black Leather, 512GB)");
        p12.setSlug("xiaomi-14-ultra-512gb");
        p12.setSku("XIA-14U-512");
        p12.setDescription("The pinnacle of mobile imaging co-engineered with Leica. Quad 50MP cameras with Sony LYT-900 1-inch sensor and stepless aperture.");
        p12.setBrand(xiaomi); p12.setCategory(catFlagship);
        p12.setPrice(new BigDecimal("99999.00")); p12.setOriginalPrice(new BigDecimal("119999.00"));
        p12.setDiscountPercent(17); p12.setStockQuantity(10); p12.setRating(4.9); p12.setReviewCount(88);
        p12.setIsFeatured(true); p12.setIsTrending(false); p12.setIsLatest(false); p12.setIs5g(true);
        p12.setRam("16GB"); p12.setStorage("512GB"); p12.setColor("Black Leather");
        p12.setBattery("5000 mAh 90W Wired + 80W Wireless"); p12.setDisplay("6.73-inch WQHD+ AMOLED 120Hz LTPO");
        p12.setProcessor("Qualcomm Snapdragon 8 Gen 3"); p12.setCamera("Quad 50MP Leica Summilux Lens System (1\" LYT-900)");
        p12.setOs("Xiaomi HyperOS based on Android 14"); p12.setWarranty("1 Year Comprehensive Brand Warranty");
        p12.setMainImageUrl("https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=800");
        addP.accept(p12);

        // 13. Redmi Note 14 Pro+ 5G
        Product p13 = new Product();
        p13.setName("Redmi Note 14 Pro+ 5G (Phantom Purple, 256GB)");
        p13.setSlug("redmi-note-14-pro-plus-256gb");
        p13.setSku("RMI-N14PP-256");
        p13.setDescription("Flagship curved 1.5K 120Hz AMOLED display, 6200 mAh silicon-carbon massive battery with 90W HyperCharge and IP69 rating.");
        p13.setBrand(xiaomi); p13.setCategory(catBudget);
        p13.setPrice(new BigDecimal("30999.00")); p13.setOriginalPrice(new BigDecimal("34999.00"));
        p13.setDiscountPercent(11); p13.setStockQuantity(40); p13.setRating(4.6); p13.setReviewCount(350);
        p13.setIsFeatured(false); p13.setIsTrending(true); p13.setIsLatest(true); p13.setIs5g(true);
        p13.setRam("12GB"); p13.setStorage("256GB"); p13.setColor("Phantom Purple");
        p13.setBattery("6200 mAh with 90W HyperCharge"); p13.setDisplay("6.67-inch 1.5K Curved AMOLED 120Hz");
        p13.setProcessor("Snapdragon 7s Gen 3"); p13.setCamera("50MP Light Fusion 800 OIS + 50MP 2.5x Tele + 8MP UW");
        p13.setOs("Xiaomi HyperOS"); p13.setWarranty("1 Year Brand Warranty");
        p13.setMainImageUrl("https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800");
        addP.accept(p13);

        // 14. Vivo X200 Pro 5G
        Product p14 = new Product();
        p14.setName("Vivo X200 Pro 5G (Titanium Blue, 512GB)");
        p14.setSlug("vivo-x200-pro-512gb");
        p14.setSku("VIV-X200P-512");
        p14.setDescription("Co-engineered with ZEISS. Features 200MP APO Telephoto lens, MediaTek Dimensity 9400 3nm chip, and 6000mAh BlueOcean battery.");
        p14.setBrand(vivo); p14.setCategory(catFlagship);
        p14.setPrice(new BigDecimal("94999.00")); p14.setOriginalPrice(new BigDecimal("99999.00"));
        p14.setDiscountPercent(5); p14.setStockQuantity(15); p14.setRating(4.9); p14.setReviewCount(85);
        p14.setIsFeatured(true); p14.setIsTrending(true); p14.setIsLatest(true); p14.setIs5g(true);
        p14.setRam("16GB"); p14.setStorage("512GB"); p14.setColor("Titanium Blue");
        p14.setBattery("6000 mAh 90W FlashCharge"); p14.setDisplay("6.78-inch Quad Curved LTPO AMOLED 120Hz 4500 nits");
        p14.setProcessor("MediaTek Dimensity 9400 (3nm)"); p14.setCamera("50MP Sony LYT-818 + 200MP ZEISS APO Telephoto + 50MP UW");
        p14.setOs("Funtouch OS 15 based on Android 15"); p14.setWarranty("1 Year Brand Warranty");
        p14.setMainImageUrl("https://images.unsplash.com/photo-1567581935884-3349723552ca?w=800");
        addP.accept(p14);

        // 15. Vivo V40 Pro 5G
        Product p15 = new Product();
        p15.setName("Vivo V40 Pro 5G (Ganges Blue, 256GB)");
        p15.setSlug("vivo-v40-pro-256gb");
        p15.setSku("VIV-V40P-256");
        p15.setDescription("ZEISS Multifocal Portrait system with 50MP Sony IMX921 sensor, 5500 mAh battery, 80W charging in an ultra-slim 7.58mm body.");
        p15.setBrand(vivo); p15.setCategory(catSmartphones);
        p15.setPrice(new BigDecimal("49999.00")); p15.setOriginalPrice(new BigDecimal("54999.00"));
        p15.setDiscountPercent(9); p15.setStockQuantity(24); p15.setRating(4.7); p15.setReviewCount(190);
        p15.setIsFeatured(false); p15.setIsTrending(true); p15.setIsLatest(false); p15.setIs5g(true);
        p15.setRam("8GB"); p15.setStorage("256GB"); p15.setColor("Ganges Blue");
        p15.setBattery("5500 mAh 80W FlashCharge"); p15.setDisplay("6.78-inch 1.5K 3D Curved AMOLED 120Hz");
        p15.setProcessor("MediaTek Dimensity 9200+"); p15.setCamera("50MP ZEISS OIS + 50MP Telephoto + 50MP UW");
        p15.setOs("Funtouch OS 14"); p15.setWarranty("1 Year Brand Warranty");
        p15.setMainImageUrl("https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800");
        addP.accept(p15);

        // 16. Oppo Find X8 Pro 5G
        Product p16 = new Product();
        p16.setName("Oppo Find X8 Pro 5G (Space Black, 512GB)");
        p16.setSlug("oppo-find-x8-pro-512gb");
        p16.setSku("OPP-X8P-512");
        p16.setDescription("Dual periscope Hasselblad telephoto system, dedicated Quick Button shutter key, Dimensity 9400, and 5910mAh Glacier battery.");
        p16.setBrand(oppo); p16.setCategory(catFlagship);
        p16.setPrice(new BigDecimal("99999.00")); p16.setOriginalPrice(new BigDecimal("109999.00"));
        p16.setDiscountPercent(9); p16.setStockQuantity(12); p16.setRating(4.8); p16.setReviewCount(70);
        p16.setIsFeatured(false); p16.setIsTrending(true); p16.setIsLatest(true); p16.setIs5g(true);
        p16.setRam("16GB"); p16.setStorage("512GB"); p16.setColor("Space Black");
        p16.setBattery("5910 mAh 80W SUPERVOOC"); p16.setDisplay("6.78-inch Infinite View AMOLED 120Hz");
        p16.setProcessor("MediaTek Dimensity 9400"); p16.setCamera("50MP Main + 50MP UW + 50MP 3x Periscope + 50MP 6x Periscope");
        p16.setOs("ColorOS 15 based on Android 15"); p16.setWarranty("1 Year Brand Warranty");
        p16.setMainImageUrl("https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800");
        addP.accept(p16);

        // 17. Realme GT 7 Pro 5G
        Product p17 = new Product();
        p17.setName("Realme GT 7 Pro 5G (Mars Orange, 256GB)");
        p17.setSlug("realme-gt-7-pro-256gb");
        p17.setSku("RLM-GT7P-256");
        p17.setDescription("India's first Snapdragon 8 Elite flagship phone with underwater photography mode, 6500mAh Titan battery and 120W Ultra Charge.");
        p17.setBrand(realme); p17.setCategory(catFlagship);
        p17.setPrice(new BigDecimal("59999.00")); p17.setOriginalPrice(new BigDecimal("64999.00"));
        p17.setDiscountPercent(8); p17.setStockQuantity(20); p17.setRating(4.7); p17.setReviewCount(140);
        p17.setIsFeatured(true); p17.setIsTrending(true); p17.setIsLatest(true); p17.setIs5g(true);
        p17.setRam("12GB"); p17.setStorage("256GB"); p17.setColor("Mars Orange");
        p17.setBattery("6500 mAh 120W Fast Charging"); p17.setDisplay("6.78-inch Samsung Eco² OLED Plus 120Hz 6000 nits");
        p17.setProcessor("Snapdragon 8 Elite"); p17.setCamera("50MP Sony IMX906 OIS + 50MP 3x Periscope + 8MP UW");
        p17.setOs("realme UI 6.0 based on Android 15"); p17.setWarranty("1 Year Brand Warranty");
        p17.setMainImageUrl("https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800");
        addP.accept(p17);

        // 18. Realme 13 Pro+ 5G
        Product p18 = new Product();
        p18.setName("Realme 13 Pro+ 5G (Monet Gold, 256GB)");
        p18.setSlug("realme-13-pro-plus-256gb");
        p18.setSku("RLM-13PP-256");
        p18.setDescription("World's first Sony LYT-701 with LYT-600 Periscope camera, Monet-inspired glass art body, and HYPERIMAGE+ camera architecture.");
        p18.setBrand(realme); p18.setCategory(catBudget);
        p18.setPrice(new BigDecimal("31999.00")); p18.setOriginalPrice(new BigDecimal("36999.00"));
        p18.setDiscountPercent(14); p18.setStockQuantity(30); p18.setRating(4.5); p18.setReviewCount(220);
        p18.setIsFeatured(false); p18.setIsTrending(false); p18.setIsLatest(false); p18.setIs5g(true);
        p18.setRam("8GB"); p18.setStorage("256GB"); p18.setColor("Monet Gold");
        p18.setBattery("5200 mAh with 80W SUPERVOOC"); p18.setDisplay("6.7-inch FHD+ 120Hz Curved OLED");
        p18.setProcessor("Snapdragon 7s Gen 2"); p18.setCamera("50MP OIS LYT-701 + 50MP 3x Periscope + 8MP UW");
        p18.setOs("realme UI 5.0"); p18.setWarranty("1 Year Brand Warranty");
        p18.setMainImageUrl("https://images.unsplash.com/photo-1567581935884-3349723552ca?w=800");
        addP.accept(p18);

        // 19. Motorola Edge 50 Ultra 5G
        Product p19 = new Product();
        p19.setName("Motorola Edge 50 Ultra 5G (Nordic Wood, 512GB)");
        p19.setSlug("motorola-edge-50-ultra-512gb");
        p19.setSku("MOT-E50U-512");
        p19.setDescription("Real wood finish back with Moto AI, Snapdragon 8s Gen 3, Pantone validated camera and display, and 125W TurboPower charging.");
        p19.setBrand(motorola); p19.setCategory(catFlagship);
        p19.setPrice(new BigDecimal("59999.00")); p19.setOriginalPrice(new BigDecimal("64999.00"));
        p19.setDiscountPercent(8); p19.setStockQuantity(16); p19.setRating(4.7); p19.setReviewCount(130);
        p19.setIsFeatured(false); p19.setIsTrending(true); p19.setIsLatest(false); p19.setIs5g(true);
        p19.setRam("16GB"); p19.setStorage("512GB"); p19.setColor("Nordic Wood");
        p19.setBattery("4500 mAh with 125W TurboPower + 50W Wireless"); p19.setDisplay("6.7-inch 1.5K Super HD pOLED 144Hz 2800 nits");
        p19.setProcessor("Snapdragon 8s Gen 3"); p19.setCamera("50MP OIS + 50MP UW + 64MP 3x Periscope");
        p19.setOs("Hello UI based on Android 14"); p19.setWarranty("1 Year Brand Warranty");
        p19.setMainImageUrl("https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=800");
        addP.accept(p19);

        // 20. Motorola Edge 50 Fusion 5G
        Product p20 = new Product();
        p20.setName("Motorola Edge 50 Fusion 5G (Marshmallow Blue, 256GB)");
        p20.setSlug("motorola-edge-50-fusion-256gb");
        p20.setSku("MOT-E50F-256");
        p20.setDescription("Segment's best curved 144Hz pOLED display, IP68 underwater protection, 50MP Sony LYT-700C OIS sensor, and 68W TurboPower.");
        p20.setBrand(motorola); p20.setCategory(catBudget);
        p20.setPrice(new BigDecimal("22999.00")); p20.setOriginalPrice(new BigDecimal("25999.00"));
        p20.setDiscountPercent(12); p20.setStockQuantity(35); p20.setRating(4.6); p20.setReviewCount(410);
        p20.setIsFeatured(false); p20.setIsTrending(true); p20.setIsLatest(false); p20.setIs5g(true);
        p20.setRam("8GB"); p20.setStorage("256GB"); p20.setColor("Marshmallow Blue");
        p20.setBattery("5000 mAh 68W TurboPower"); p20.setDisplay("6.67-inch FHD+ 3D Curved pOLED 144Hz");
        p20.setProcessor("Snapdragon 7s Gen 2"); p20.setCamera("50MP Sony LYT-700C OIS + 13MP UW/Macro");
        p20.setOs("Hello UI on Android 14"); p20.setWarranty("1 Year Brand Warranty");
        p20.setMainImageUrl("https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800");
        addP.accept(p20);

        // 21. Nothing Phone (2a) Plus 5G
        Product p21 = new Product();
        p21.setName("Nothing Phone (2a) Plus 5G (Metallic Grey, 256GB)");
        p21.setSlug("nothing-phone-2a-plus-256gb");
        p21.setSku("NOTH-2AP-256");
        p21.setDescription("Iconic transparent back with Glyph LED interface, exclusive Dimensity 7350 Pro 5G processor, dual 50MP cameras and 50MP selfie.");
        p21.setBrand(nothing); p21.setCategory(cat5G);
        p21.setPrice(new BigDecimal("27999.00")); p21.setOriginalPrice(new BigDecimal("29999.00"));
        p21.setDiscountPercent(7); p21.setStockQuantity(25); p21.setRating(4.7); p21.setReviewCount(310);
        p21.setIsFeatured(true); p21.setIsTrending(true); p21.setIsLatest(true); p21.setIs5g(true);
        p21.setRam("8GB"); p21.setStorage("256GB"); p21.setColor("Metallic Grey");
        p21.setBattery("5000 mAh with 50W Fast Charging"); p21.setDisplay("6.7-inch Flexible AMOLED 120Hz 1300 nits");
        p21.setProcessor("MediaTek Dimensity 7350 Pro 5G"); p21.setCamera("Dual 50MP (Main OIS + Ultra-Wide) + 50MP Selfie");
        p21.setOs("Nothing OS 2.6 on Android 14"); p21.setWarranty("1 Year Brand Warranty");
        p21.setMainImageUrl("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800");
        addP.accept(p21);

        // 22. Nothing Phone (2)
        Product p22 = new Product();
        p22.setName("Nothing Phone (2) 5G (Dark Grey, 256GB)");
        p22.setSlug("nothing-phone-2-256gb");
        p22.setSku("NOTH-P2-256");
        p22.setDescription("Premium flagship glyph smartphone powered by Snapdragon 8+ Gen 1, LTPO OLED display, and premium curved pillowed glass.");
        p22.setBrand(nothing); p22.setCategory(catSmartphones);
        p22.setPrice(new BigDecimal("36999.00")); p22.setOriginalPrice(new BigDecimal("44999.00"));
        p22.setDiscountPercent(18); p22.setStockQuantity(18); p22.setRating(4.6); p22.setReviewCount(240);
        p22.setIsFeatured(false); p22.setIsTrending(false); p22.setIsLatest(false); p22.setIs5g(true);
        p22.setRam("12GB"); p22.setStorage("256GB"); p22.setColor("Dark Grey");
        p22.setBattery("4700 mAh 45W Wired + 15W Wireless"); p22.setDisplay("6.7-inch LTPO OLED 120Hz");
        p22.setProcessor("Qualcomm Snapdragon 8+ Gen 1"); p22.setCamera("50MP Sony IMX890 OIS + 50MP Samsung JN1 UW");
        p22.setOs("Nothing OS 2.5"); p22.setWarranty("1 Year Brand Warranty");
        p22.setMainImageUrl("https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800");
        addP.accept(p22);

        // 23. Samsung Galaxy Z Flip 6
        Product p23 = new Product();
        p23.setName("Samsung Galaxy Z Flip 6 5G (Mint, 256GB)");
        p23.setSlug("samsung-galaxy-z-flip-6-256gb");
        p23.setSku("SAM-ZFLIP6-256");
        p23.setDescription("Compact pocket-sized flip phone with 3.4\" FlexWindow, 50MP main camera with ProVisual Engine, and vapor chamber cooling.");
        p23.setBrand(samsung); p23.setCategory(catFoldable);
        p23.setPrice(new BigDecimal("109999.00")); p23.setOriginalPrice(new BigDecimal("119999.00"));
        p23.setDiscountPercent(8); p23.setStockQuantity(10); p23.setRating(4.7); p23.setReviewCount(82);
        p23.setIsFeatured(false); p23.setIsTrending(true); p23.setIsLatest(true); p23.setIs5g(true);
        p23.setRam("12GB"); p23.setStorage("256GB"); p23.setColor("Mint");
        p23.setBattery("4000 mAh 25W Fast Charging"); p23.setDisplay("6.7\" FHD+ Dynamic AMOLED 2X 120Hz + 3.4\" Super AMOLED");
        p23.setProcessor("Snapdragon 8 Gen 3 for Galaxy"); p23.setCamera("50MP OIS + 12MP UW");
        p23.setOs("Android 14, One UI 6.1.1"); p23.setWarranty("1 Year Manufacturer Warranty");
        p23.setMainImageUrl("https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=800");
        addP.accept(p23);

        // 24. Samsung Galaxy A55 5G
        Product p24 = new Product();
        p24.setName("Samsung Galaxy A55 5G (Awesome Iceblue, 128GB)");
        p24.setSlug("samsung-galaxy-a55-128gb");
        p24.setSku("SAM-A55-128");
        p24.setDescription("Premium metal frame with Corning Gorilla Glass Victus+, Knox Security Vault, IP67 water resistance, and Nightography camera.");
        p24.setBrand(samsung); p24.setCategory(catSmartphones);
        p24.setPrice(new BigDecimal("39999.00")); p24.setOriginalPrice(new BigDecimal("42999.00"));
        p24.setDiscountPercent(7); p24.setStockQuantity(25); p24.setRating(4.5); p24.setReviewCount(310);
        p24.setIsFeatured(false); p24.setIsTrending(false); p24.setIsLatest(false); p24.setIs5g(true);
        p24.setRam("8GB"); p24.setStorage("128GB"); p24.setColor("Awesome Iceblue");
        p24.setBattery("5000 mAh 25W Fast Charging"); p24.setDisplay("6.6-inch Super AMOLED 120Hz 1000 nits");
        p24.setProcessor("Exynos 1480 with AMD Xclipse 530 GPU"); p24.setCamera("50MP OIS + 12MP UW + 5MP Macro");
        p24.setOs("Android 14 (4 OS Upgrades)"); p24.setWarranty("1 Year Brand Warranty");
        p24.setMainImageUrl("https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800");
        addP.accept(p24);

        // 25. Apple iPhone 14
        Product p25 = new Product();
        p25.setName("Apple iPhone 14 (Starlight, 128GB)");
        p25.setSlug("apple-iphone-14-128gb");
        p25.setSku("APL-IP14-128");
        p25.setDescription("All-day battery life, Action mode for smooth handheld videos, Crash Detection, and dual camera system.");
        p25.setBrand(apple); p25.setCategory(catSmartphones);
        p25.setPrice(new BigDecimal("49900.00")); p25.setOriginalPrice(new BigDecimal("59900.00"));
        p25.setDiscountPercent(17); p25.setStockQuantity(20); p25.setRating(4.7); p25.setReviewCount(1150);
        p25.setIsFeatured(false); p25.setIsTrending(false); p25.setIsLatest(false); p25.setIs5g(true);
        p25.setRam("6GB"); p25.setStorage("128GB"); p25.setColor("Starlight");
        p25.setBattery("3279 mAh"); p25.setDisplay("6.1-inch Super Retina XDR OLED");
        p25.setProcessor("Apple A15 Bionic"); p25.setCamera("12MP Main + 12MP Ultra Wide");
        p25.setOs("iOS 16 (Upgradable to iOS 18)"); p25.setWarranty("1 Year Apple India Warranty");
        p25.setMainImageUrl("https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800");
        addP.accept(p25);

        // 26. Apple iPad Air 11" M2
        Product p26 = new Product();
        p26.setName("Apple iPad Air 11-inch M2 (Space Grey, 128GB, Wi-Fi)");
        p26.setSlug("apple-ipad-air-11-m2-128gb");
        p26.setSku("APL-IPADAIR-M2");
        p26.setDescription("Redesigned with incredible performance from the Apple M2 chip, Liquid Retina display, landscape 12MP camera, and Apple Pencil Pro support.");
        p26.setBrand(apple); p26.setCategory(catTablets);
        p26.setPrice(new BigDecimal("59900.00")); p26.setOriginalPrice(new BigDecimal("64900.00"));
        p26.setDiscountPercent(8); p26.setStockQuantity(15); p26.setRating(4.9); p26.setReviewCount(180);
        p26.setIsFeatured(true); p26.setIsTrending(false); p26.setIsLatest(true); p26.setIs5g(false);
        p26.setRam("8GB"); p26.setStorage("128GB"); p26.setColor("Space Grey");
        p26.setBattery("28.93-watt-hour rechargeable lithium-polymer"); p26.setDisplay("11-inch Liquid Retina display with True Tone");
        p26.setProcessor("Apple M2 (8-core CPU, 10-core GPU)"); p26.setCamera("12MP Wide back + 12MP Landscape Ultra Wide front");
        p26.setOs("iPadOS 18"); p26.setWarranty("1 Year Apple Warranty");
        p26.setMainImageUrl("https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800");
        addP.accept(p26);

        // 27. Samsung Galaxy Tab S9 FE
        Product p27 = new Product();
        p27.setName("Samsung Galaxy Tab S9 FE Wi-Fi (Gray, 128GB)");
        p27.setSlug("samsung-galaxy-tab-s9-fe-128gb");
        p27.setSku("SAM-TABS9FE-128");
        p27.setDescription("Vibrant 10.9-inch display, in-box IP68 water-resistant S Pen, stereo dual speakers by AKG, and 8,000 mAh battery.");
        p27.setBrand(samsung); p27.setCategory(catTablets);
        p27.setPrice(new BigDecimal("34999.00")); p27.setOriginalPrice(new BigDecimal("44999.00"));
        p27.setDiscountPercent(22); p27.setStockQuantity(18); p27.setRating(4.6); p27.setReviewCount(140);
        p27.setIsFeatured(false); p27.setIsTrending(false); p27.setIsLatest(false); p27.setIs5g(false);
        p27.setRam("6GB"); p27.setStorage("128GB"); p27.setColor("Gray");
        p27.setBattery("8000 mAh 45W Fast Charging"); p27.setDisplay("10.9-inch WQXGA LCD 90Hz");
        p27.setProcessor("Exynos 1380"); p27.setCamera("8MP Rear + 12MP Ultra-Wide Front");
        p27.setOs("Android 14 with One UI 6"); p27.setWarranty("1 Year Brand Warranty");
        p27.setMainImageUrl("https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800");
        addP.accept(p27);

        // 28. Apple Watch Series 10
        Product p28 = new Product();
        p28.setName("Apple Watch Series 10 GPS 46mm (Jet Black Aluminium)");
        p28.setSlug("apple-watch-series-10-46mm");
        p28.setSku("APL-AW10-46");
        p28.setDescription("Thinnest Apple Watch ever with the biggest wide-angle OLED display, sleep apnea notifications, and faster charging.");
        p28.setBrand(apple); p28.setCategory(catSmartwatches);
        p28.setPrice(new BigDecimal("49900.00")); p28.setOriginalPrice(new BigDecimal("51900.00"));
        p28.setDiscountPercent(4); p28.setStockQuantity(20); p28.setRating(4.8); p28.setReviewCount(95);
        p28.setIsFeatured(true); p28.setIsTrending(true); p28.setIsLatest(true); p28.setIs5g(false);
        p28.setRam("1GB"); p28.setStorage("64GB"); p28.setColor("Jet Black");
        p28.setBattery("Up to 18 hours (36 hours Low Power Mode)"); p28.setDisplay("Wide-angle OLED Always-On Retina up to 2000 nits");
        p28.setProcessor("Apple S10 SiP"); p28.setCamera("N/A");
        p28.setOs("watchOS 11"); p28.setWarranty("1 Year Apple India Warranty");
        p28.setMainImageUrl("https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800");
        addP.accept(p28);

        // 29. Samsung Galaxy Watch Ultra
        Product p29 = new Product();
        p29.setName("Samsung Galaxy Watch Ultra LTE 47mm (Titanium Gray)");
        p29.setSlug("samsung-galaxy-watch-ultra-47mm");
        p29.setSku("SAM-WULTRA-47");
        p29.setDescription("Grade 4 titanium cushion design, 100-hour battery life, 10 ATM water resistance, dual-frequency GPS, and BioActive sensor.");
        p29.setBrand(samsung); p29.setCategory(catSmartwatches);
        p29.setPrice(new BigDecimal("59999.00")); p29.setOriginalPrice(new BigDecimal("69999.00"));
        p29.setDiscountPercent(14); p29.setStockQuantity(12); p29.setRating(4.7); p29.setReviewCount(65);
        p29.setIsFeatured(false); p29.setIsTrending(false); p29.setIsLatest(true); p29.setIs5g(true);
        p29.setRam("2GB"); p29.setStorage("32GB"); p29.setColor("Titanium Gray");
        p29.setBattery("590 mAh (up to 100 hours)"); p29.setDisplay("1.5-inch Super AMOLED 3000 nits Sapphire Crystal");
        p29.setProcessor("Exynos W1000 (3nm)"); p29.setCamera("N/A");
        p29.setOs("Wear OS 5 with One UI 6 Watch"); p29.setWarranty("1 Year Manufacturer Warranty");
        p29.setMainImageUrl("https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800");
        addP.accept(p29);

        // 30. OnePlus Watch 2
        Product p30 = new Product();
        p30.setName("OnePlus Watch 2 (Radiant Steel, 46mm)");
        p30.setSlug("oneplus-watch-2-46mm");
        p30.setSku("OP-WATCH2-46");
        p30.setDescription("Dual-Engine Architecture with Snapdragon W5 + BES2700 for up to 100 hours battery life. Wear OS 4 by Google with sapphire crystal glass.");
        p30.setBrand(oneplus); p30.setCategory(catSmartwatches);
        p30.setPrice(new BigDecimal("21999.00")); p30.setOriginalPrice(new BigDecimal("24999.00"));
        p30.setDiscountPercent(12); p30.setStockQuantity(22); p30.setRating(4.6); p30.setReviewCount(110);
        p30.setIsFeatured(false); p30.setIsTrending(false); p30.setIsLatest(false); p30.setIs5g(false);
        p30.setRam("2GB"); p30.setStorage("32GB"); p30.setColor("Radiant Steel");
        p30.setBattery("500 mAh (up to 100 hours)"); p30.setDisplay("1.43-inch AMOLED 60Hz 1000 nits Sapphire Crystal");
        p30.setProcessor("Snapdragon W5 Gen 1 + BES2700"); p30.setCamera("N/A");
        p30.setOs("Wear OS 4 by Google"); p30.setWarranty("1 Year Brand Warranty");
        p30.setMainImageUrl("https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800");
        addP.accept(p30);

        // --- 10 ACCESSORIES ---
        // 31. Apple AirPods Pro (2nd Gen, USB-C)
        Product a1 = new Product();
        a1.setName("Apple AirPods Pro (2nd Generation with MagSafe Case USB-C)");
        a1.setSlug("apple-airpods-pro-2nd-gen-usbc");
        a1.setSku("APL-AIRPODS-PRO2");
        a1.setDescription("Up to 2x more Active Noise Cancellation, Transparency mode, Personalized Spatial Audio, and hearing health features.");
        a1.setBrand(apple); a1.setCategory(catAccessories);
        a1.setPrice(new BigDecimal("21990.00")); a1.setOriginalPrice(new BigDecimal("24900.00"));
        a1.setDiscountPercent(12); a1.setStockQuantity(30); a1.setRating(4.9); a1.setReviewCount(740);
        a1.setIsFeatured(true); a1.setIsTrending(true); a1.setIsLatest(false); a1.setIs5g(false);
        a1.setRam("N/A"); a1.setStorage("N/A"); a1.setColor("White");
        a1.setBattery("Up to 30 hours total listening time"); a1.setDisplay("N/A");
        a1.setProcessor("Apple H2 Headphone Chip"); a1.setCamera("N/A");
        a1.setOs("iOS / macOS / Android compatible"); a1.setWarranty("1 Year Apple Warranty");
        a1.setMainImageUrl("https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800");
        addP.accept(a1);

        // 32. Samsung Galaxy Buds 3 Pro
        Product a2 = new Product();
        a2.setName("Samsung Galaxy Buds 3 Pro (Silver)");
        a2.setSlug("samsung-galaxy-buds-3-pro-silver");
        a2.setSku("SAM-BUDS3PRO-SLV");
        a2.setDescription("Blade design with Blade Lights, 24-bit Hi-Fi audio, enhanced 2-way speaker with planar tweeter, and Galaxy AI Adaptive ANC.");
        a2.setBrand(samsung); a2.setCategory(catAccessories);
        a2.setPrice(new BigDecimal("18999.00")); a2.setOriginalPrice(new BigDecimal("19999.00"));
        a2.setDiscountPercent(5); a2.setStockQuantity(25); a2.setRating(4.7); a2.setReviewCount(160);
        a2.setIsFeatured(false); a2.setIsTrending(true); a2.setIsLatest(true); a2.setIs5g(false);
        a2.setRam("N/A"); a2.setStorage("N/A"); a2.setColor("Silver");
        a2.setBattery("Up to 30 hours with charging case"); a2.setDisplay("N/A");
        a2.setProcessor("Dual Amp Sound Architecture"); a2.setCamera("N/A");
        a2.setOs("Android / iOS compatible"); a2.setWarranty("1 Year Brand Warranty");
        a2.setMainImageUrl("https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800");
        addP.accept(a2);

        // 33. OnePlus Buds Pro 3
        Product a3 = new Product();
        a3.setName("OnePlus Buds Pro 3 (Midnight Opus)");
        a3.setSlug("oneplus-buds-pro-3-midnight");
        a3.setSku("OP-BUDSPRO3-BLK");
        a3.setDescription("Dual drivers tuned by Dynaudio, up to 50dB Adaptive Noise Cancellation, LHDC 5.0 24-bit/192kHz audio, and 43 hours battery life.");
        a3.setBrand(oneplus); a3.setCategory(catAccessories);
        a3.setPrice(new BigDecimal("11999.00")); a3.setOriginalPrice(new BigDecimal("13999.00"));
        a3.setDiscountPercent(14); a3.setStockQuantity(28); a3.setRating(4.8); a3.setReviewCount(185);
        a3.setIsFeatured(false); a3.setIsTrending(false); a3.setIsLatest(true); a3.setIs5g(false);
        a3.setRam("N/A"); a3.setStorage("N/A"); a3.setColor("Midnight Opus");
        a3.setBattery("43 hours battery with warp charge"); a3.setDisplay("N/A");
        a3.setProcessor("Dual DAC + Dual Drivers Dynaudio"); a3.setCamera("N/A");
        a3.setOs("Bluetooth 5.4"); a3.setWarranty("1 Year Brand Warranty");
        a3.setMainImageUrl("https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800");
        addP.accept(a3);

        // 34. Apple 20W USB-C Power Adapter
        Product a4 = new Product();
        a4.setName("Apple 20W USB-C Power Adapter");
        a4.setSlug("apple-20w-usbc-power-adapter");
        a4.setSku("APL-CHRG-20W");
        a4.setDescription("Fast and efficient charging for iPhone 16, 15, 14 series and iPad. Charges to 50% in approximately 30 minutes.");
        a4.setBrand(apple); a4.setCategory(catAccessories);
        a4.setPrice(new BigDecimal("1699.00")); a4.setOriginalPrice(new BigDecimal("1900.00"));
        a4.setDiscountPercent(11); a4.setStockQuantity(50); a4.setRating(4.8); a4.setReviewCount(1890);
        a4.setIsFeatured(false); a4.setIsTrending(true); a4.setIsLatest(false); a4.setIs5g(false);
        a4.setRam("N/A"); a4.setStorage("N/A"); a4.setColor("White");
        a4.setBattery("N/A"); a4.setDisplay("N/A"); a4.setProcessor("Apple Power Management"); a4.setCamera("N/A");
        a4.setOs("Universal USB-C PD"); a4.setWarranty("1 Year Apple Warranty");
        a4.setMainImageUrl("https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800");
        addP.accept(a4);

        // 35. OnePlus SUPERVOOC 100W Dual Port Power Adapter
        Product a5 = new Product();
        a5.setName("OnePlus SUPERVOOC 100W Dual Ports Power Adapter (Type-A + Type-C)");
        a5.setSlug("oneplus-supervooc-100w-charger");
        a5.setSku("OP-CHRG-100W");
        a5.setDescription("Ultra-fast dual port 100W adapter supporting SUPERVOOC, PD, QC, and PPS fast charging protocols for phones and laptops.");
        a5.setBrand(oneplus); a5.setCategory(catAccessories);
        a5.setPrice(new BigDecimal("3499.00")); a5.setOriginalPrice(new BigDecimal("3999.00"));
        a5.setDiscountPercent(13); a5.setStockQuantity(40); a5.setRating(4.9); a5.setReviewCount(420);
        a5.setIsFeatured(false); a5.setIsTrending(false); a5.setIsLatest(false); a5.setIs5g(false);
        a5.setRam("N/A"); a5.setStorage("N/A"); a5.setColor("White");
        a5.setBattery("N/A"); a5.setDisplay("N/A"); a5.setProcessor("SUPERVOOC Flash Controller"); a5.setCamera("N/A");
        a5.setOs("USB-C PD 3.0 / PPS Compatible"); a5.setWarranty("1 Year Brand Warranty");
        a5.setMainImageUrl("https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800");
        addP.accept(a5);

        // 36. Apple MagSafe Charger 15W
        Product a6 = new Product();
        a6.setName("Apple MagSafe Wireless Charger (1m Cable)");
        a6.setSlug("apple-magsafe-wireless-charger");
        a6.setSku("APL-MAGSAFE-1M");
        a6.setDescription("Perfect magnetic alignment snaps effortlessly onto iPhone 12 through iPhone 16 models for faster wireless charging up to 25W.");
        a6.setBrand(apple); a6.setCategory(catAccessories);
        a6.setPrice(new BigDecimal("4299.00")); a6.setOriginalPrice(new BigDecimal("4500.00"));
        a6.setDiscountPercent(4); a6.setStockQuantity(35); a6.setRating(4.7); a6.setReviewCount(310);
        a6.setIsFeatured(false); a6.setIsTrending(false); a6.setIsLatest(false); a6.setIs5g(false);
        a6.setRam("N/A"); a6.setStorage("N/A"); a6.setColor("Silver");
        a6.setBattery("N/A"); a6.setDisplay("N/A"); a6.setProcessor("Qi2 / MagSafe Standard"); a6.setCamera("N/A");
        a6.setOs("iOS Compatible"); a6.setWarranty("1 Year Apple Warranty");
        a6.setMainImageUrl("https://images.unsplash.com/photo-1622445268047-97d38392135a?w=800");
        addP.accept(a6);

        // 37. Samsung 45W Power Adapter with Cable
        Product a7 = new Product();
        a7.setName("Samsung 45W USB-C Super Fast Charging 2.0 Adapter");
        a7.setSlug("samsung-45w-power-adapter");
        a7.setSku("SAM-CHRG-45W");
        a7.setDescription("Super Fast Charging 2.0 with GaN tech for Galaxy S25 Ultra, S24 Ultra, S24+, Note series and Galaxy Book laptops.");
        a7.setBrand(samsung); a7.setCategory(catAccessories);
        a7.setPrice(new BigDecimal("2999.00")); a7.setOriginalPrice(new BigDecimal("3499.00"));
        a7.setDiscountPercent(14); a7.setStockQuantity(45); a7.setRating(4.8); a7.setReviewCount(620);
        a7.setIsFeatured(false); a7.setIsTrending(true); a7.setIsLatest(false); a7.setIs5g(false);
        a7.setRam("N/A"); a7.setStorage("N/A"); a7.setColor("Black");
        a7.setBattery("N/A"); a7.setDisplay("N/A"); a7.setProcessor("GaN Power IC"); a7.setCamera("N/A");
        a7.setOs("USB-C PD 3.0 / PPS"); a7.setWarranty("1 Year Brand Warranty");
        a7.setMainImageUrl("https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800");
        addP.accept(a7);

        // 38. Nothing Ear (Open)
        Product a8 = new Product();
        a8.setName("Nothing Ear (Open) True Wireless Open-Ear Earbuds (White)");
        a8.setSlug("nothing-ear-open-white");
        a8.setSku("NOTH-EAROPEN-WHT");
        a8.setDescription("Open Sound Technology with Sound Seal System, directional acoustic design, custom stepped driver with titanium coating, and ChatGPT integration.");
        a8.setBrand(nothing); a8.setCategory(catAccessories);
        a8.setPrice(new BigDecimal("17999.00")); a8.setOriginalPrice(new BigDecimal("19999.00"));
        a8.setDiscountPercent(10); a8.setStockQuantity(20); a8.setRating(4.6); a8.setReviewCount(90);
        a8.setIsFeatured(false); a8.setIsTrending(false); a8.setIsLatest(true); a8.setIs5g(false);
        a8.setRam("N/A"); a8.setStorage("N/A"); a8.setColor("White");
        a8.setBattery("30 hours playback with case"); a8.setDisplay("N/A");
        a8.setProcessor("Custom 14.2mm Titanium Driver"); a8.setCamera("N/A");
        a8.setOs("Bluetooth 5.3"); a8.setWarranty("1 Year Brand Warranty");
        a8.setMainImageUrl("https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800");
        addP.accept(a8);

        // 39. Spigen Tough Armor Case for iPhone 16 Pro Max
        Product a9 = new Product();
        a9.setName("Spigen Tough Armor MagFit Case for iPhone 16 Pro Max (Gunmetal)");
        a9.setSlug("spigen-tough-armor-iphone-16-pro-max");
        a9.setSku("SPG-TA-IP16PM");
        a9.setDescription("Military-grade dual-layer protection with Air Cushion Technology and extreme impact foam, reinforced built-in kickstand, and MagSafe magnet.");
        a9.setBrand(apple); a9.setCategory(catAccessories);
        a9.setPrice(new BigDecimal("2699.00")); a9.setOriginalPrice(new BigDecimal("3499.00"));
        a9.setDiscountPercent(23); a9.setStockQuantity(60); a9.setRating(4.9); a9.setReviewCount(520);
        a9.setIsFeatured(false); a9.setIsTrending(false); a9.setIsLatest(true); a9.setIs5g(false);
        a9.setRam("N/A"); a9.setStorage("N/A"); a9.setColor("Gunmetal");
        a9.setBattery("N/A"); a9.setDisplay("N/A"); a9.setProcessor("N/A"); a9.setCamera("N/A");
        a9.setOs("N/A"); a9.setWarranty("6 Months Manufacturer Warranty");
        a9.setMainImageUrl("https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800");
        addP.accept(a9);

        // 40. Anker 65W GaNPrime 3-Port Fast Charger
        Product a10 = new Product();
        a10.setName("Anker 735 Charger (GaNPrime 65W 3-Port USB-C + USB-A)");
        a10.setSlug("anker-ganprime-65w-charger");
        a10.setSku("ANK-735-65W");
        a10.setDescription("High-speed compact charger powered by GaNPrime. Simultaneously charge 3 devices including MacBook, iPhone, and Android phones.");
        a10.setBrand(google); a10.setCategory(catAccessories);
        a10.setPrice(new BigDecimal("4999.00")); a10.setOriginalPrice(new BigDecimal("6499.00"));
        a10.setDiscountPercent(23); a10.setStockQuantity(25); a10.setRating(4.8); a10.setReviewCount(310);
        a10.setIsFeatured(false); a10.setIsTrending(false); a10.setIsLatest(false); a10.setIs5g(false);
        a10.setRam("N/A"); a10.setStorage("N/A"); a10.setColor("Black");
        a10.setBattery("N/A"); a10.setDisplay("N/A"); a10.setProcessor("GaNPrime Intelligent PowerIQ 4.0"); a10.setCamera("N/A");
        a10.setOs("Universal PD 3.0 / PPS / QC 4.0"); a10.setWarranty("18 Months Brand Warranty");
        a10.setMainImageUrl("https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800");
        addP.accept(a10);

        // 6. COUPONS
        couponRepository.save(new Coupon("WELCOME10", Coupon.DiscountType.PERCENTAGE, new BigDecimal("10.00"), new BigDecimal("1999.00"), new BigDecimal("1500.00"), LocalDate.now().plusMonths(6)));
        couponRepository.save(new Coupon("MOBILE500", Coupon.DiscountType.FIXED, new BigDecimal("500.00"), new BigDecimal("9999.00"), new BigDecimal("500.00"), LocalDate.now().plusMonths(3)));
        couponRepository.save(new Coupon("FESTIVE20", Coupon.DiscountType.PERCENTAGE, new BigDecimal("20.00"), new BigDecimal("4999.00"), new BigDecimal("3000.00"), LocalDate.now().plusMonths(4)));
        couponRepository.save(new Coupon("FLAT1000", Coupon.DiscountType.FIXED, new BigDecimal("1000.00"), new BigDecimal("29999.00"), new BigDecimal("1000.00"), LocalDate.now().plusMonths(6)));

        // 7. BANNERS
        bannerRepository.save(new Banner(
                "Upgrade Your World",
                "Flagship Smartphones from Apple, Samsung, OnePlus & Google with Instant ₹5,000 Bank Cashback & No-Cost EMI.",
                "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=1600",
                "/products",
                "Shop Smartphones",
                1
        ));
        bannerRepository.save(new Banner(
                "Samsung Galaxy S25 Series",
                "Next-Era Galaxy AI meets Snapdragon 8 Elite. Redefine what's possible in mobile photography.",
                "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=1600",
                "/product/samsung-galaxy-s25-ultra-512gb",
                "Pre-Order S25 Ultra",
                2
        ));
        bannerRepository.save(new Banner(
                "Unbeatable Audio & Fast Chargers",
                "Active Noise Cancelling earbuds and GaN chargers at up to 40% discount with free express courier delivery.",
                "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=1600",
                "/products?category=audio-accessories",
                "Explore Accessories",
                3
        ));

        // 8. SAMPLE INITIAL REVIEWS
        reviewRepository.save(new Review(p1, customer, 5, "Unbelievable Camera and Battery!", "Upgraded from iPhone 13 Pro. The 5x periscope telephoto lens and 4K 120fps video are mind-blowing. Battery lasts 1.5 full days easily.", true));
        reviewRepository.save(new Review(p4, customer, 5, "Best Android flagship ever made", "The anti-reflective screen on S25 Ultra makes outdoor viewing crystal clear. Galaxy AI summary and photo editing tools work like magic.", true));
        reviewRepository.save(new Review(p7, customer, 5, "Super fast and buttery smooth", "OxygenOS is blazing fast. The 100W SUPERVOOC charging goes from 0 to 100% in just 26 minutes! Absolutely in love with this phone.", true));
        reviewRepository.save(new Review(a1, customer, 5, "Best in-ear ANC hands down", "Sound quality is punchy and spatial audio creates an immersive 3D stage. USB-C convenience is great.", true));

        // 9. SAMPLE INITIAL ORDER
        Order sampleOrder = new Order();
        sampleOrder.setUser(customer);
        sampleOrder.setOrderNumber("MH-SAMPLE-10023");
        sampleOrder.setTrackingNumber("TRK98421038");
        sampleOrder.setOrderStatus(Order.OrderStatus.SHIPPED);
        sampleOrder.setPaymentMethod(Order.PaymentMethod.UPI);
        sampleOrder.setPaymentStatus(Order.PaymentStatus.PAID);
        sampleOrder.setShippingFullName("Rahul Sharma");
        sampleOrder.setShippingPhone("9812345678");
        sampleOrder.setShippingAddressLine1("Flat 402, Sunshine Heights");
        sampleOrder.setShippingAddressLine2("Andheri West");
        sampleOrder.setShippingCity("Mumbai");
        sampleOrder.setShippingState("Maharashtra");
        sampleOrder.setShippingPincode("400053");
        sampleOrder.setSubtotal(new BigDecimal("74900.00"));
        sampleOrder.setDiscount(new BigDecimal("5000.00"));
        sampleOrder.setCouponCode("MOBILE500");
        sampleOrder.setCouponDiscount(new BigDecimal("500.00"));
        sampleOrder.setTax(new BigDecimal("13392.00"));
        sampleOrder.setShippingFee(BigDecimal.ZERO);
        sampleOrder.setTotalAmount(new BigDecimal("87792.00"));
        sampleOrder.setEstimatedDeliveryDate(LocalDateTime.now().plusDays(2));

        OrderItem orderItem1 = new OrderItem(
                sampleOrder,
                p2,
                p2.getName(),
                p2.getSku(),
                p2.getMainImageUrl(),
                1,
                p2.getPrice(),
                p2.getPrice(),
                "Ultramarine",
                "128GB",
                "8GB"
        );
        sampleOrder.getItems().add(orderItem1);
        Order savedOrder = orderRepository.save(sampleOrder);

        Payment samplePayment = new Payment(
                savedOrder,
                "TXN-UPI-" + System.currentTimeMillis(),
                Order.PaymentMethod.UPI,
                savedOrder.getTotalAmount(),
                Order.PaymentStatus.PAID
        );
        paymentRepository.save(samplePayment);

        logger.info("Database initialized successfully with 40 products, 10 brands, 8 categories, active coupons, demo users, and banners!");
    }
}
