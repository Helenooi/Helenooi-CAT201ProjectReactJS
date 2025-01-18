package java;
import java.io.*;
import java.nio.file.*;
import java.util.*;

public class ProductManager {
    private static final String CSV_PATH = "public/public/product.csv";

    public static boolean deleteProduct(String clothesName) {
        try {
            List<String> lines = Files.readAllLines(Paths.get(CSV_PATH));
            List<String> updatedLines = new ArrayList<>();
            boolean found = false;

            updatedLines.add(lines.get(0)); // Keep header

            for (int i = 1; i < lines.size(); i++) {
                String[] parts = lines.get(i).split(",");
                if (parts.length > 0 && !parts[0].trim().equals(clothesName.trim())) {
                    updatedLines.add(lines.get(i));
                } else {
                    found = true;
                }
            }

            if (found) {
                Files.write(Paths.get(CSV_PATH), updatedLines);
                return true;
            }
            return false;
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }
    }

    public static boolean editProduct(String originalName, String newData) {
        try {
            List<String> lines = Files.readAllLines(Paths.get(CSV_PATH));
            List<String> updatedLines = new ArrayList<>();
            boolean found = false;

            updatedLines.add(lines.get(0)); // Keep header

            for (int i = 1; i < lines.size(); i++) {
                String[] parts = lines.get(i).split(",");
                if (parts.length > 0 && parts[0].trim().equals(originalName.trim())) {
                    updatedLines.add(newData);
                    found = true;
                } else {
                    updatedLines.add(lines.get(i));
                }
            }

            if (found) {
                Files.write(Paths.get(CSV_PATH), updatedLines);
                return true;
            }
            return false;
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }
    }
}