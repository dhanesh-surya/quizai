# Homepage Content Management System

## Overview

A comprehensive Django-based system to edit all homepage sections through Django Admin. All content from the landing page (Stats, Features, Testimonials, Footer) can now be dynamically managed without editing HTML files.

## 🎯 Features

### Editable Sections:
1. **Hero Section** - Main header, badge, CTA buttons
2. **Stats Cards** - Statistics display (10K+ users, etc.)
3. **Features** - Feature cards with icons and descriptions
4. **Testimonials** - User reviews and ratings
5. **Footer** - Brand info, links, social media
6. **Section Headings** - All section titles and subtitles

## 📋 Models Created

### 1. **HeroSection** (Singleton)
- Badge text
- Heading (line 1, line 2, highlighted text)
- Subheading
- CTA button texts and URLs

### 2. **StatCard**
- Title (e.g., "10K+")
- Subtitle (e.g., "Active Learners")
- Order (for sorting)
- Active status

### 3. **Feature**
- Title
- Description
- Icon (FontAwesome class)
- Icon gradient (Tailwind classes)
- Order and active status

### 4. **Testimonial**
- Name, Role
- Testimonial text
- Rating (1-5 stars)
- Avatar letter and gradient
- Order and active status

### 5. **FooterSection** (Singleton)
- Brand name, tagline, icon
- Copyright text
- Social media URLs (Twitter, LinkedIn, GitHub, etc.)

### 6. **FooterLink**
- Column (Product, Company, Support, Legal)
- Link text and URL
- Order and active status

### 7. **SectionHeading**
- Section identifier (features, testimonials, etc.)
- Title (supports HTML)
- Subtitle

## 🚀 How to Use

### Step 1: Access Django Admin
Navigate to: `http://localhost:8001/admin/`

### Step 2: Look for "Homepage Content Management" Section
You'll find these models in the admin:
- **Hero Section** - Edit main hero content
- **Stat Cards** - Manage statistics
- **Features** - Add/edit/delete features
- **Testimonials** - Manage user reviews
- **Footer Section** - Edit footer content
- **Footer Links** - Manage footer navigation
- **Section Headings** - Edit section titles

### Step 3: Edit Content

#### For Hero Section:
1. Click "Hero Section"
2. Edit badge text, headings, subheading
3. Update CTA button text and URLs
4. Click "Save"

#### For Stats:
1. Click "Stat Cards"
2. Each row shows: Title | Subtitle | Order | Active
3. You can quick-edit Order and Active status directly
4. Click row to edit Title and Subtitle
5. Click "Save"

#### For Features:
1. Click "Features"
2. Add new features with "Add Feature" button
3. Choose icon from dropdown (FontAwesome icons)
4. Select gradient color scheme
5. Set order number for positioning
6. Mark as active/inactive
7. Click "Save"

#### For Testimonials:
1. Click "Testimonials"
2. Add new testimonials
3. Name auto-fills avatar letter
4. Choose rating (1-5 stars)
5. Select avatar gradient
6. Set order for display sequence

#### For Footer:
1. Click "Footer Section"
2. Edit brand info and social links
3. Use inline editor to add/edit footer links
4. Links are grouped by column (Product, Company, etc.)

#### For Section Headings:
1. Click "Section Headings"
2. Edit titles and subtitles for each section
3. Can use HTML in title field for gradient text:
   ```html
   Powerful Features for <span class="gradient-text">Effective Learning</span>
   ```

## 🔧 Management Commands

### Populate Default Content
```bash
python manage.py populate_homepage
```

This creates all default homepage content from the existing landing page.

## 💻 Technical Details

### Database Tables
- `quiz_heroection`
- `quiz_statcard`
- `quiz_feature`
- `quiz_testimonial`
- `quiz_footersection`
- `quiz_footerlink`
- `quiz_sectionheading`

### Context Processor
`quiz.context_processors.homepage_content` provides these variables to all templates:
- `hero_section`
- `stats_cards`
- `features`
- `testimonials`
- `footer_section`
- `section_headings` (dict with: features, testimonials, how_it_works, cta)

### Template Usage (Example)
```django
<!-- Hero Section -->
<h1>{{ hero_section.heading_line1 }}</h1>
<p>{{ hero_section.subheading }}</p>

<!-- Stats -->
{% for stat in stats_cards %}
    <div>{{ stat.title }} - {{ stat.subtitle }}</div>
{% endfor %}

<!-- Features -->
{% for feature in features %}
    <div>
        <i class="fas {{ feature.icon }}"></i>
        <h3>{{ feature.title }}</h3>
        <p>{{ feature.description }}</p>
    </div>
{% endfor %}

<!-- Testimonials -->
{% for testimonial in testimonials %}
    <div>
        <strong>{{ testimonial.name }}</strong> - {{ testimonial.role }}
        <p>{{ testimonial.testimonial }}</p>
        Rating: {{ testimonial.rating }}/5
    </div>
{% endfor %}

<!-- Footer -->
<h4>{{ footer_section.brand_name }}</h4>
<p>{{ footer_section.brand_tagline }}</p>

<!-- Section Headings -->
<h2>{{ section_headings.features.title|safe }}</h2>
<p>{{ section_headings.features.subtitle }}</p>
```

## 📝 Admin Features

### List View Features:
- **Inline editing** - Edit order and status directly from list
- **Filtering** - Filter by active status, type, etc.
- **Search** - Search by title, name, description
- **Ordering** - Automatic ordering by 'order' field

### Form Features:
- **Fieldsets** - Organized into logical groups
- **Help text** - Guidance for each field
- **Choices** - Dropdown menus for icons, gradients
- **Validation** - Automatic validation (e.g., rating 1-5)
- **Auto-fill** - Avatar letter auto-fills from name

### Singleton Models:
- **Hero Section** - Only one instance allowed
- **Footer Section** - Only one instance allowed
- Can't delete singleton instances
- Can't add multiple instances

## 🎨 Icon and Gradient Options

### Available Icons (FontAwesome):
- fa-robot, fa-chart-line, fa-certificate
- fa-clock, fa-infinity, fa-mobile-alt
- fa-brain, fa-graduation-cap, fa-trophy
- fa-star, fa-bolt, fa-users

### Available Gradients (Tailwind):
- Blue to Purple
- Purple to Pink
- Pink to Red
- Blue to Cyan
- Green to Emerald
- Yellow to Orange
- Indigo to Blue
- Red to Pink

## 🔄 Updating Landing Page Template

To use the dynamic content, update `landing.html`:

1. Loop through `stats_cards` instead of hardcoded stats
2. Loop through `features` instead of hardcoded features
3. Loop through `testimonials` instead of hardcoded reviews
4. Use `hero_section` fields for hero content
5. Use `footer_section` for footer content
6. Use `section_headings` for section titles

## ✅ Testing

1. Login to admin
2. Edit Hero Section - change heading
3. Add a new Feature
4. Deactivate a Stat Card
5. Edit a Testimonial
6. View landing page
7. Verify changes appear

## 🚨 Important Notes

- **Ordering**: Lower order numbers appear first
- **Active Status**: Only active items display on frontend
- **Singleton Models**: Can't be deleted or duplicated
- **Gradients**: Use Tailwind CSS gradient classes
- **Icons**: Use FontAwesome 'fa-*' classes
- **HTML in Headings**: Allowed for gradient text effect

## 📊 Admin Screenshots

The admin interface provides:
- Color-coded status badges (Active/Inactive)
- Star ratings display for testimonials
- Icon previews for features
- Inline editing for quick updates
- Organized fieldsets for complex forms

## 🎯 Best Practices

1. **Keep Order Sequential**: Use 1, 2, 3... for clarity
2. **Test Active Status**: Use before deleting items
3. **Backup Data**: Before major changes
4. **Use Meaningful Icons**: Match content to icon
5. **Test on Mobile**: Ensure order makes sense
6. **Limit Items**: 4 stats, 6 features, 3 testimonials ideal

## 🔗 Related Files

- **Models**: `quiz/models_homepage.py`
- **Admin**: `quiz/admin.py` (lines 367+)
- **Context Processor**: `quiz/context_processors.py`
- **Management Command**: `quiz/management/commands/populate_homepage.py`
- **Template**: `quiz/templates/quiz/landing.html`

---

**Created**: 2026-01-27
**Version**: 1.0
**Author**: Antigravity AI Assistant
