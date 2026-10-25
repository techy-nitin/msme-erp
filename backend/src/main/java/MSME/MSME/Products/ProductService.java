package MSME.MSME.Products;

import MSME.MSME.Categories.CategoryEntity;
import MSME.MSME.Categories.CategoryRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public ProductService(ProductRepository productRepository,
                          CategoryRepository categoryRepository) {

        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    // ============================================
    // CREATE PRODUCT
    // ============================================

    public ProductResponse createProduct(ProductRequest request) {

        CategoryEntity category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() ->
                        new EntityNotFoundException("Category not found."));

        ProductEntity product = new ProductEntity();

        product.setCategory(category);
        product.setProductName(request.getProductName());
        product.setDescription(request.getDescription());
        product.setHsnCode(request.getHsnCode());
        product.setUnit(request.getUnit());
        product.setPrice(request.getPrice());
        product.setGstPercentage(request.getGstPercentage());
        product.setStockQuantity(request.getStockQuantity());

        product = productRepository.save(product);

        return mapToResponse(product);
    }

    // ============================================
    // GET ALL PRODUCTS
    // ============================================

    public List<ProductResponse> getAllProducts() {

        List<ProductEntity> products = productRepository.findAll();

        List<ProductResponse> responses = new ArrayList<>();

        for (ProductEntity product : products) {

            responses.add(mapToResponse(product));

        }

        return responses;
    }

    // ============================================
    // GET PRODUCT BY ID
    // ============================================

    public ProductResponse getProductById(Long id) {

        ProductEntity product = productRepository.findById(id)
                .orElseThrow(() ->
                        new EntityNotFoundException("Product not found."));

        return mapToResponse(product);
    }
    // ============================================
    // UPDATE PRODUCT
    // ============================================

    public ProductResponse updateProduct(Long id,
                                         ProductRequest request) {

        ProductEntity product = productRepository.findById(id)
                .orElseThrow(() ->
                        new EntityNotFoundException("Product not found."));

        CategoryEntity category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() ->
                        new EntityNotFoundException("Category not found."));

        product.setCategory(category);
        product.setProductName(request.getProductName());
        product.setDescription(request.getDescription());
        product.setHsnCode(request.getHsnCode());
        product.setUnit(request.getUnit());
        product.setPrice(request.getPrice());
        product.setGstPercentage(request.getGstPercentage());
        product.setStockQuantity(request.getStockQuantity());

        product = productRepository.save(product);

        return mapToResponse(product);
    }

    // ============================================
    // DELETE PRODUCT
    // ============================================

    public void deleteProduct(Long id) {

        ProductEntity product = productRepository.findById(id)
                .orElseThrow(() ->
                        new EntityNotFoundException("Product not found."));

        productRepository.delete(product);
    }

    // ============================================
    // SEARCH PRODUCT BY NAME
    // ============================================

    public List<ProductResponse> searchProducts(String productName) {

        List<ProductEntity> products =
                productRepository.findByProductNameContainingIgnoreCase(productName);

        List<ProductResponse> responses = new ArrayList<>();

        for (ProductEntity product : products) {

            responses.add(mapToResponse(product));

        }

        return responses;
    }

    // ============================================
    // GET PRODUCTS BY CATEGORY
    // ============================================

    public List<ProductResponse> getProductsByCategory(Long categoryId) {

        CategoryEntity category = categoryRepository.findById(categoryId)
                .orElseThrow(() ->
                        new EntityNotFoundException("Category not found."));

        List<ProductEntity> products =
                productRepository.findByCategory(category);

        List<ProductResponse> responses = new ArrayList<>();

        for (ProductEntity product : products) {

            responses.add(mapToResponse(product));

        }

        return responses;
    }

    // ============================================
    // MAP ENTITY TO RESPONSE
    // ============================================

    private ProductResponse mapToResponse(ProductEntity product) {

        ProductResponse response = new ProductResponse();

        response.setId(product.getId());

        if (product.getCategory() != null) {
            response.setCategoryId(product.getCategory().getId());
            response.setCategoryName(product.getCategory().getCategoryName());
        }

        response.setProductName(product.getProductName());
        response.setDescription(product.getDescription());
        response.setHsnCode(product.getHsnCode());
        response.setUnit(product.getUnit());
        response.setPrice(product.getPrice());
        response.setGstPercentage(product.getGstPercentage());
        response.setStockQuantity(product.getStockQuantity());
        response.setCreatedAt(product.getCreatedAt());
        response.setUpdatedAt(product.getUpdatedAt());

        return response;
    }

}