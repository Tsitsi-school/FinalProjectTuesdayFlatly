package com.flatly.service;

import com.amazonaws.services.s3.model.DeleteObjectRequest;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.PutObjectRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.UUID;

@Service
public class S3Service {

    private final AmazonS3 s3Client;

    @Value("${aws.s3.bucket}")
    private String bucketName;

    public S3Service(@Value("${aws.access.key}") String accessKey,
                     @Value("${aws.secret.key}") String secretKey,
                     @Value("${aws.region}") String region) {
        BasicAWSCredentials creds = new BasicAWSCredentials(accessKey, secretKey);
        this.s3Client = AmazonS3ClientBuilder.standard()
                .withRegion(region)
                .withCredentials(new AWSStaticCredentialsProvider(creds))
                .build();
    }

    /**
     * Uploads the given file to S3 and returns the file's public URL.
     *
     * @param file the MultipartFile to upload
     * @return the public URL of the uploaded file
     */
    public String uploadFile(MultipartFile file) {
        String fileUrl = "";
        try {
            File convertedFile = convertMultiPartToFile(file);
            String fileName = generateFileName(file);
            fileUrl = "https://" + bucketName + ".s3.amazonaws.com/" + fileName;
            s3Client.putObject(new PutObjectRequest(bucketName, fileName, convertedFile)
                    .withCannedAcl(CannedAccessControlList.PublicRead));
            convertedFile.delete(); // Clean up the temporary file
        } catch (Exception e) {
            e.printStackTrace();
            // Optionally, you can throw a custom exception here
        }
        return fileUrl;
    }

    private File convertMultiPartToFile(MultipartFile file) throws IOException {
        File convFile = new File(file.getOriginalFilename());
        try (FileOutputStream fos = new FileOutputStream(convFile)) {
            fos.write(file.getBytes());
        }
        return convFile;
    }

    public void deleteFile(String imageUrl) {
        // Assuming your imageUrl is in the form: "https://<bucket-name>.s3.amazonaws.com/<key>"
        // Extract the S3 key by taking the substring after the last "/"
        String key = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
        s3Client.deleteObject(new DeleteObjectRequest(bucketName, key));
    }
        private String generateFileName(MultipartFile multiPart) {
            return UUID.randomUUID().toString() + "_" + multiPart.getOriginalFilename().replace(" ", "_");
        }
    }
