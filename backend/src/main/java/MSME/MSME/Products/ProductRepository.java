package MSME.MSME.Products;

import MSME.MSME.Categories.CategoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<ProductEntity, Long> {

    List<ProductEntity> findByProductNameContainingIgnoreCase(String productName);

    List<ProductEntity> findByCategory(CategoryEntity category);

}