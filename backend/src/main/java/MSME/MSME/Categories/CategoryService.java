package MSME.MSME.Categories;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    // ============================================
    // CREATE CATEGORY
    // ============================================

    public CategoryResponse createCategory(CategoryRequest request) {

        if (categoryRepository.existsByCategoryName(request.getCategoryName())) {
            throw new RuntimeException("Category already exists.");
        }

        CategoryEntity category = new CategoryEntity();

        category.setCategoryName(request.getCategoryName());
        category.setDescription(request.getDescription());

        category = categoryRepository.save(category);

        return mapToResponse(category);
    }

    // ============================================
    // GET ALL CATEGORIES
    // ============================================

    public List<CategoryResponse> getAllCategories() {

        List<CategoryEntity> categories = categoryRepository.findAll();

        List<CategoryResponse> responses = new ArrayList<>();

        for (CategoryEntity category : categories) {
            responses.add(mapToResponse(category));
        }

        return responses;
    }

    // ============================================
    // GET CATEGORY BY ID
    // ============================================

    public CategoryResponse getCategoryById(Long id) {

        CategoryEntity category = categoryRepository.findById(id)
                .orElseThrow(() ->
                        new EntityNotFoundException("Category not found."));

        return mapToResponse(category);
    }

    // ============================================
    // UPDATE CATEGORY
    // ============================================

    public CategoryResponse updateCategory(Long id,
                                           CategoryRequest request) {

        CategoryEntity category = categoryRepository.findById(id)
                .orElseThrow(() ->
                        new EntityNotFoundException("Category not found."));

        if (!category.getCategoryName().equals(request.getCategoryName())
                && categoryRepository.existsByCategoryName(request.getCategoryName())) {

            throw new RuntimeException("Category name already exists.");
        }

        category.setCategoryName(request.getCategoryName());
        category.setDescription(request.getDescription());

        category = categoryRepository.save(category);

        return mapToResponse(category);
    }

    // ============================================
    // DELETE CATEGORY
    // ============================================

    public void deleteCategory(Long id) {

        CategoryEntity category = categoryRepository.findById(id)
                .orElseThrow(() ->
                        new EntityNotFoundException("Category not found."));

        categoryRepository.delete(category);
    }

    // ============================================
    // MAP ENTITY TO RESPONSE
    // ============================================

    private CategoryResponse mapToResponse(CategoryEntity category) {

        CategoryResponse response = new CategoryResponse();

        response.setId(category.getId());
        response.setCategoryName(category.getCategoryName());
        response.setDescription(category.getDescription());
        response.setCreatedAt(category.getCreatedAt());

        return response;
    }

}