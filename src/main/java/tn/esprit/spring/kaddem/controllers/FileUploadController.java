package tn.esprit.spring.kaddem.controllers;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.MvcUriComponentsBuilder;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/upload")
@Slf4j
public class FileUploadController {

    @Value("${file.upload-dir:./uploeds}")
    private String uploadDir;
    
    private Path root;
    
    @PostConstruct
    public void init() {
        try {
            root = Paths.get(uploadDir);
            if (!Files.exists(root)) {
                Files.createDirectories(root);
                log.info("Upload directory created at: {}", root.toAbsolutePath());
            } else {
                log.info("Upload directory exists at: {}", root.toAbsolutePath());
            }
        } catch (IOException e) {
            log.error("Could not initialize storage location: {}", e.getMessage());
            throw new RuntimeException("Could not initialize storage location", e);
        }
    }
    
    @PostMapping("/upload-image")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Please upload a non-empty file");
            }
            
            // Get file extension
            String originalFilename = file.getOriginalFilename();
            if (originalFilename == null || originalFilename.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Original filename cannot be empty");
            }
            
            // Create a unique filename (timestamp + original filename)
            String filename = System.currentTimeMillis() + "_" + originalFilename;
            
            // Save the file with StandardCopyOption.REPLACE_EXISTING option
            Files.copy(file.getInputStream(), root.resolve(filename), StandardCopyOption.REPLACE_EXISTING);
            
            // Return the file URL
            String fileUrl = MvcUriComponentsBuilder
                .fromMethodName(FileUploadController.class, "getFile", filename)
                .build().toString();
                
            return ResponseEntity.status(HttpStatus.OK).body(fileUrl);
        } catch (Exception e) {
            log.error("Error during file upload: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error during file upload: " + e.getMessage());
        }
    }
    
    @GetMapping("/files")
    public ResponseEntity<List<String>> getFilesList() {
        try {
            List<String> fileUrls = Files.list(root)
                .map(path -> MvcUriComponentsBuilder
                    .fromMethodName(FileUploadController.class, "getFile", path.getFileName().toString())
                    .build().toString())
                .collect(Collectors.toList());
                
            return ResponseEntity.status(HttpStatus.OK).body(fileUrls);
        } catch (IOException e) {
            log.error("Could not load the files: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ArrayList<>());
        }
    }
    
    @GetMapping("/files/{filename:.+}")
    @ResponseBody
    public ResponseEntity<Resource> getFile(@PathVariable String filename) {
        try {
            Path file = root.resolve(filename);
            Resource resource = new UrlResource(file.toUri());
            
            if (resource.exists() || resource.isReadable()) {
                // Try to determine file's content type
                String contentType = null;
                try {
                    contentType = Files.probeContentType(file);
                } catch (IOException e) {
                    log.warn("Could not determine file type: {}", e.getMessage());
                }
                
                // Fallback to a default content type if type could not be determined
                if (contentType == null) {
                    contentType = "application/octet-stream";
                }
                
                return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                    .header(HttpHeaders.CONTENT_TYPE, contentType)
                    .body(resource);
            } else {
                log.error("Could not read the file: {}", filename);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
        } catch (MalformedURLException e) {
            log.error("Error accessing file: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
} 