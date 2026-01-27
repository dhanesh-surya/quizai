# Theme Template Error - FIXED

**Error:** `ValueError: The 'background_image' attribute has no file associated with it.`

**Location:** `quiz/templates/quiz/theme_styles.html` line 252

---

## Problem

When the SiteTheme model had `background_type='image'` but no actual image file was uploaded to the `background_image` field, the template would try to access `.url` on an empty ImageField, causing a ValueError.

The original check:
```django
{% elif active_theme.background_type == 'image' and active_theme.background_image %}
```

This doesn't work because an empty ImageField is still "truthy" in Django templates.

---

## Solution

Changed the condition to check if the image field actually has a file:

```django
{% elif active_theme.background_type == 'image' and active_theme.background_image.name %}
```

The `.name` attribute only exists when a file is actually uploaded, so this properly prevents the error.

---

## Additional Fix

The entire `theme_styles.html` file was corrupted with malformed template tags (Django tags were rendered as `{ { } }` instead of `{{ }}`). The file has been completely rewritten with correct syntax.

---

## Status

✅ **FIXED** - Dashboard and all portal pages should now load correctly, even when no background image is set.

---

## Testing

1. Navigate to: `http://127.0.0.1:8000/dashboard/`
2. Should load without errors
3. Change background type in admin to verify:
   - Solid color background
   - Gradient background  
   - Image background (with and without actual image uploaded)
