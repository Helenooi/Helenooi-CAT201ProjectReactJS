import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.HashMap;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

public class HttpServerApp {

    public static void main(String[] args) throws Exception {
        HttpServer server = HttpServer.create(new java.net.InetSocketAddress(8080), 0);

        // Handle /api/addproduct
        server.createContext("/api/addproduct", new AddProductHandler());

        server.setExecutor(null); // creates a default executor
        server.start();
        System.out.println("Server started on port 8080...");
    }

    static class AddProductHandler implements HttpHandler {

        // Multipart boundary pattern
        private static final String BOUNDARY_PATTERN = "boundary=([^\"]+)";

        @Override
        public void handle(HttpExchange exchange) throws IOException {

            // Handle CORS
            exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
            exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "POST, OPTIONS");
            exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type, Authorization");

            // Handle OPTIONS request for pre-flight checks
            if ("OPTIONS".equals(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(200, -1);
                return;
            }

            // Handle POST request
            if ("POST".equals(exchange.getRequestMethod())) {
                String contentType = exchange.getRequestHeaders().getFirst("Content-Type");

                // Extract boundary from content type (multipart form data)
                String boundary = extractBoundary(contentType);

                // Parse the request body (multipart data)
                InputStream inputStream = exchange.getRequestBody();
                StringBuilder requestBody = new StringBuilder();
                byte[] buffer = new byte[8192];
                int bytesRead;

                while ((bytesRead = inputStream.read(buffer)) != -1) {
                    requestBody.append(new String(buffer, 0, bytesRead, StandardCharsets.UTF_8));
                }

                // Parse multipart data into fields and files
                Map<String, String> formFields = new HashMap<>();
                Map<String, File> uploadedFiles = new HashMap<>();
                parseMultipartData(requestBody.toString(), boundary, formFields, uploadedFiles);

                // Log parsed fields for debugging
                System.out.println("Form Fields: " + formFields);
                System.out.println("Uploaded Files: " + uploadedFiles);

                // Process form data (Save to JSON, etc.)
                String jsonData = createJsonData(formFields, uploadedFiles);

                // Save to file
                saveProductToJson(jsonData);

                // Send success response
                String response = "{\"message\": \"Product added successfully!\"}";
                exchange.sendResponseHeaders(200, response.getBytes().length);
                OutputStream os = exchange.getResponseBody();
                os.write(response.getBytes());
                os.close();
            } else {
                // Handle unsupported method
                String response = "{\"message\": \"Invalid request method\"}";
                exchange.sendResponseHeaders(405, response.getBytes().length);
                OutputStream os = exchange.getResponseBody();
                os.write(response.getBytes());
                os.close();
            }
        }

        // Extract the boundary from the Content-Type header
        private String extractBoundary(String contentType) {
            Pattern pattern = Pattern.compile(BOUNDARY_PATTERN);
            Matcher matcher = pattern.matcher(contentType);
            if (matcher.find()) {
                return matcher.group(1);
            }
            return "";
        }

        // Parse the multipart data and extract fields and files
        private void parseMultipartData(String data, String boundary, Map<String, String> formFields, Map<String, File> uploadedFiles) {
            String[] parts = data.split("--" + boundary);
            for (String part : parts) {
                if (part.contains("Content-Disposition")) {
                    String[] headersAndBody = part.split("\r\n\r\n");
                    if (headersAndBody.length < 2) continue;

                    String headers = headersAndBody[0];
                    String body = headersAndBody[1].trim();

                    // Extract content disposition and content type
                    if (headers.contains("form-data")) {
                        String name = extractFormFieldName(headers);
                        if (headers.contains("filename")) {
                            // This is a file
                            File file = new File("uploads/" + name);
                            try (BufferedWriter writer = new BufferedWriter(new FileWriter(file))) {
                                writer.write(body);
                            } catch (IOException e) {
                                e.printStackTrace();
                            }
                            uploadedFiles.put(name, file);
                        } else {
                            // This is a text field
                            formFields.put(name, body);
                        }
                    }
                }
            }
        }

        // Extract the field name from the Content-Disposition header
        private String extractFormFieldName(String header) {
            Pattern pattern = Pattern.compile("name=\"([^\"]+)\"");
            Matcher matcher = pattern.matcher(header);
            if (matcher.find()) {
                return matcher.group(1);
            }
            return "";
        }

        // Create a JSON-like string for the product data
        private String createJsonData(Map<String, String> formFields, Map<String, File> uploadedFiles) {
            String clothesName = formFields.get("clothesname");
            String size = formFields.get("size");
            String retailPrice = formFields.get("retailprice");
            String description = formFields.get("description");

            // Assume we just save the file names (file paths) in the JSON data
            String fileName = uploadedFiles.isEmpty() ? "No file uploaded" : uploadedFiles.values().iterator().next().getName();

            return String.format(
                    "{\"productName\": \"%s\", \"size\": \"%s\", \"retailPrice\": \"%s\", \"picture\": \"%s\", \"description\": \"%s\"}",
                    clothesName, size, retailPrice, fileName, description
            );
        }

        // Save product data to JSON file
        private void saveProductToJson(String productData) {
            File file = new File("product.json");
            try (BufferedWriter writer = new BufferedWriter(new FileWriter(file, true))) {
                writer.write(productData + "\n");
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}
