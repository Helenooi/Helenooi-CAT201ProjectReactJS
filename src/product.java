public class product {
    private String productName;
    private String size;
    private double retailPrice;
    private String picture;
    private String description;

    public product(String productName, String size, double retailPrice, String picture, String description) {
        this.productName = productName;
        this.size = size;
        this.retailPrice = retailPrice;
        this.picture = picture;
        this.description = description;
    }

    public String getProductName() {
        return productName;
    }

    public String getSize() {
        return size;
    }

    public double getRetailPrice() {
        return retailPrice;
    }

    public String getPicture() {
        return picture;
    }

    public String getDescription() {
        return description;
    }
}
