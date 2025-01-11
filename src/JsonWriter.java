import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;

public class JsonWriter {
    public static void main(String[] args) {
        // JSON data as a string
        String jsonData = "[\n" +
                          "  {\"productName\": \"T-shirt\", \"size\": \"M\", \"retailPrice\": 19.99, \"picture\": \"tshirt.jpg\", \"description\": \"A cool t-shirt\"},\n" +
                          "  {\"productName\": \"Jeans\", \"size\": \"L\", \"retailPrice\": 49.99, \"picture\": \"jeans.jpg\", \"description\": \"Comfortable jeans\"}\n" +
                          "]";

        // Write to product.json
        File file = new File("product.json");
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(file))) {
            writer.write(jsonData);
            System.out.println("JSON data written to product.json.");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
