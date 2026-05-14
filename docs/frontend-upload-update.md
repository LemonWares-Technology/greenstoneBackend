# Frontend Upload Update

The backend now supports direct local image upload on create/update endpoints. Use `multipart/form-data` with `FormData`. Do not set the `Content-Type` header manually; the browser will set the boundary.

All protected endpoints still need:

```txt
Authorization: Bearer <admin_token>
```

Max image size is `10 MB`. Accepted image types: `jpg`, `png`, `webp`, `gif`, `avif`, `svg`.

Uploaded files are served back from:

```txt
https://api-ldsv1.greenstoneng.com/upload/<filename>
```

## Gallery

```txt
POST /api/gallery
PUT  /api/gallery/:id
```

Fields:

```txt
image    File, optional if url is provided
url      String, optional if image file is provided
title    String
category String
order    Number/String, optional
```

Example:

```ts
const formData = new FormData();
formData.append('image', file);
formData.append('title', title);
formData.append('category', category);
formData.append('order', String(order));

await fetch(`${API_URL}/api/gallery`, {
  method: 'POST',
  headers: { Authorization: `Bearer ${token}` },
  body: formData,
});
```

## Services

```txt
POST /api/services
PUT  /api/services/:id
```

Fields:

```txt
image       File, optional
title       String
description String
icon        String, optional
highlights  JSON string array or comma-separated string, optional
order       Number/String, optional
```

Use:

```ts
formData.append('highlights', JSON.stringify(highlights));
```

## Blogs

```txt
POST /api/blogs
PUT  /api/blogs/:id
```

Fields:

```txt
image          File, optional if image URL is provided
title          String
author         String
role           String
tags           JSON string array or comma-separated string, optional
excerpt        String
content        String
sendNewsletter Boolean/String, optional on create
```

Use:

```ts
formData.append('tags', JSON.stringify(tags));
formData.append('sendNewsletter', String(sendNewsletter));
```

## Projects

```txt
POST /api/projects
PUT  /api/projects/:id
```

Fields:

```txt
image       File, main project image
gallery     File(s), optional, append once per gallery image
name        String
location    String
description String
status      String
value       String, optional
```

Example:

```ts
const formData = new FormData();
formData.append('image', mainImageFile);
galleryFiles.forEach((file) => formData.append('gallery', file));
formData.append('name', name);
formData.append('location', location);
formData.append('description', description);
formData.append('status', status);
formData.append('value', value);
```

## Standalone Upload

This still exists if the frontend needs it for preview-only flows:

```txt
POST /api/upload
field: image
```

For normal create forms, prefer uploading directly to the resource endpoint above.
