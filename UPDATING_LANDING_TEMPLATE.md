# Updating Landing Page to Use Dynamic Content

## Quick Reference: Template Variables

After implementing the homepage content management system, these variables are available in all templates:

```python
# Context variables automatically available:
hero_section         # HeroSection instance
stats_cards          # QuerySet of active StatCard objects
features             # QuerySet of active Feature objects
testimonials         # QuerySet of active Testimonial objects
footer_section       # FooterSection instance
section_headings     # Dict with: features, testimonials, how_it_works, cta
```

## Step-by-Step: Update landing.html

### 1. Update Hero Section (Lines 207-230)

**Before (Hardcoded):**
```html
<h1 class="text-5xl md:text-7xl font-display font-extrabold mb-6 leading-tight">
    Transform Your Learning<br />
    with <span class="gradient-text">AI-Generated Quizzes</span>
</h1>
```

**After (Dynamic):**
```html
<h1 class="text-5xl md:text-7xl font-display font-extrabold mb-6 leading-tight">
    {{ hero_section.heading_line1 }}<br />
    {{ hero_section.heading_line2 }}<span class="gradient-text">{{ hero_section.heading_highlight }}</span>
</h1>

<p class="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
    {{ hero_section.subheading }}
</p>
```

### 2. Update Stats Section (Lines 232-250)

**Before (Hardcoded 4 stats):**
```html
<div class="glass rounded-2xl p-6 transform hover:scale-105 transition-transform duration-300">
    <div class="text-4xl font-bold gradient-text mb-2">10K+</div>
    <div class="text-gray-400 text-sm">Active Learners</div>
</div>
<!-- Repeat 3 more times -->
```

**After (Dynamic loop):**
```html
{% for stat in stats_cards %}
<div class="glass rounded-2xl p-6 transform hover:scale-105 transition-transform duration-300">
    <div class="text-4xl font-bold gradient-text mb-2">{{ stat.title }}</div>
    <div class="text-gray-400 text-sm">{{ stat.subtitle }}</div>
</div>
{% endfor %}
```

### 3. Update Features Section (Lines 255-347)

**Before (Hardcoded features):**
```html
<div class="glass rounded-2xl p-8 transform hover:scale-105 transition-all duration-300">
    <div class="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
        <i class="fas fa-robot text-2xl"></i>
    </div>
    <h3 class="text-2xl font-bold mb-4">AI-Powered Generation</h3>
    <p class="text-gray-400">
        Advanced AI creates personalized quizzes...
    </p>
</div>
```

**After (Dynamic loop):**
```html
{% for feature in features %}
<div class="glass rounded-2xl p-8 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
    <div class="w-14 h-14 bg-gradient-to-br {{ feature.icon_gradient }} rounded-xl flex items-center justify-center mb-6 shadow-lg">
        <i class="fas {{ feature.icon }} text-2xl"></i>
    </div>
    <h3 class="text-2xl font-bold mb-4">{{ feature.title }}</h3>
    <p class="text-gray-400">{{ feature.description }}</p>
</div>
{% endfor %}
```

### 4. Update Section Headings

**Before (Hardcoded):**
```html
<h2 class="text-4xl md:text-5xl font-display font-bold mb-4">
    Powerful Features for <span class="gradient-text">Effective Learning</span>
</h2>
<p class="text-xl text-gray-400 max-w-2xl mx-auto">
    Everything you need to accelerate your learning journey
</p>
```

**After (Dynamic):**
```html
<h2 class="text-4xl md:text-5xl font-display font-bold mb-4">
    {{ section_headings.features.title|safe }}
</h2>
<p class="text-xl text-gray-400 max-w-2xl mx-auto">
    {{ section_headings.features.subtitle }}
</p>
```

### 5. Update Testimonials Section (Lines 407-496)

**Before (Hardcoded testimonials):**
```html
<div class="glass rounded-2xl p-8">
    <div class="flex items-center mb-4">
        <div class="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-xl font-bold mr-4">
            S
        </div>
        <div>
            <div class="font-bold">Sarah Johnson</div>
            <div class="text-sm text-gray-400">Medical Student</div>
        </div>
    </div>
    <div class="flex mb-4">
        <i class="fas fa-star text-yellow-400"></i>
        <!-- Repeat 5 times -->
    </div>
    <p class="text-gray-300">
        "MindSpark AI has revolutionized my study routine..."
    </p>
</div>
```

**After (Dynamic loop):**
```html
{% for testimonial in testimonials %}
<div class="glass rounded-2xl p-8">
    <div class="flex items-center mb-4">
        <div class="w-12 h-12 bg-gradient-to-br {{ testimonial.avatar_gradient }} rounded-full flex items-center justify-center text-xl font-bold mr-4">
            {{ testimonial.avatar_letter }}
        </div>
        <div>
            <div class="font-bold">{{ testimonial.name }}</div>
            <div class="text-sm text-gray-400">{{ testimonial.role }}</div>
        </div>
    </div>
    <div class="flex mb-4">
        {% for i in "12345"|slice:":"|slice:testimonial.rating %}
        <i class="fas fa-star text-yellow-400"></i>
        {% endfor %}
    </div>
    <p class="text-gray-300">"{{ testimonial.testimonial }}"</p>
</div>
{% endfor %}
```

### 6. Update Footer Section (Lines 518-576)

**Before (Hardcoded footer):**
```html
<div class="flex items-center space-x-2 mb-4">
    <div class="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
        <i class="fas fa-brain text-white text-xl"></i>
    </div>
    <span class="text-xl font-display font-bold">MindSpark AI</span>
</div>
<p class="text-gray-400 text-sm">
    Empowering learners worldwide with AI-powered education.
</p>
```

**After (Dynamic):**
```html
<div class="flex items-center space-x-2 mb-4">
    <div class="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
        <i class="fas {{ footer_section.brand_icon }} text-white text-xl"></i>
    </div>
    <span class="text-xl font-display font-bold">{{ footer_section.brand_name }}</span>
</div>
<p class="text-gray-400 text-sm">{{ footer_section.brand_tagline }}</p>
```

**For Footer Links:**
```html
<!-- Product Column -->
<div>
    <h4 class="font-bold mb-4">Product</h4>
    <ul class="space-y-2 text-gray-400 text-sm">
        {% for link in footer_section.links.all %}
            {% if link.column == 'product' and link.is_active %}
            <li>
                {% if link.url|slice:":4" == "http" or link.url|slice:":1" == "#" %}
                    <a href="{{ link.url }}" class="hover:text-white transition-colors">{{ link.text }}</a>
                {% else %}
                    <a href="{% url link.url %}" class="hover:text-white transition-colors">{{ link.text }}</a>
                {% endif %}
            </li>
            {% endif %}
        {% endfor %}
    </ul>
</div>

<!-- Social Media Links -->
<div class="flex space-x-4">
    {% if footer_section.twitter_url %}
    <a href="{{ footer_section.twitter_url }}" class="w-10 h-10 glass rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors">
        <i class="fab fa-twitter"></i>
    </a>
    {% endif %}
    
    {% if footer_section.linkedin_url %}
    <a href="{{ footer_section.linkedin_url }}" class="w-10 h-10 glass rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors">
        <i class="fab fa-linkedin"></i>
    </a>
    {% endif %}
    
    {% if footer_section.github_url %}
    <a href="{{ footer_section.github_url }}" class="w-10 h-10 glass rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors">
        <i class="fab fa-github"></i>
    </a>
    {% endif %}
</div>

<!-- Copyright -->
<p>© {% now "Y" %} {{ footer_section.copyright_text }}</p>
```

## Complete Updated Template Sections

### Full Hero Section with CTA Buttons:
```html
<div class="fade-in-up">
    <div class="inline-flex items-center px-4 py-2 rounded-full glass mb-8">
        <span class="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
        <span class="text-sm font-medium">{{ hero_section.badge_text }}</span>
    </div>

    <h1 class="text-5xl md:text-7xl font-display font-extrabold mb-6 leading-tight">
        {{ hero_section.heading_line1 }}<br />
        {{ hero_section.heading_line2 }}<span class="gradient-text">{{ hero_section.heading_highlight }}</span>
    </h1>

    <p class="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
        {{ hero_section.subheading }}
    </p>

    <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
        {% if hero_section.cta_primary_url|slice:":4" == "http" or hero_section.cta_primary_url|slice:":1" == "#" %}
            <a href="{{ hero_section.cta_primary_url }}"
        {% else %}
            <a href="{% url hero_section.cta_primary_url %}"
        {% endif %}
            class="group relative px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
            <span class="relative z-10">{{ hero_section.cta_primary_text }}</span>
        </a>
        
        <a href="{{ hero_section.cta_secondary_url }}"
            class="px-8 py-4 glass rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:bg-white/20">
            <i class="fas fa-play-circle mr-2"></i>
            {{ hero_section.cta_secondary_text }}
        </a>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 max-w-4xl mx-auto">
        {% for stat in stats_cards %}
        <div class="glass rounded-2xl p-6 transform hover:scale-105 transition-transform duration-300">
            <div class="text-4xl font-bold gradient-text mb-2">{{ stat.title }}</div>
            <div class="text-gray-400 text-sm">{{ stat.subtitle }}</div>
        </div>
        {% endfor %}
    </div>
</div>
```

## Template Helper for Star Ratings

Add this custom template tag for easier star rendering:

Create `quiz/templatetags/homepage_tags.py`:
```python
from django import template

register = template.Library()

@register.filter
def times(number):
    return range(number)
```

Then in template:
```html
{% load homepage_tags %}

<div class="flex mb-4">
    {% for i in testimonial.rating|times %}
    <i class="fas fa-star text-yellow-400"></i>
    {% endfor %}
</div>
```

## Testing Checklist

After updating the template:

- [ ] Hero section displays with correct heading
- [ ] All 4 stats cards appear in correct order
- [ ] All 6 features display with icons and gradients
- [ ] Testimonials show with correct ratings (stars)
- [ ] Footer brand name and tagline appear
- [ ] Footer links work correctly
- [ ] Social media icons only show if URLs exist
- [ ] Section headings render with gradient text
- [ ] Grid layout remains responsive
- [ ] Order can be changed in admin and reflects on page
- [ ] Deactivated items don't appear on page

## Common Issues & Solutions

### Issue: Template variable not found
**Solution**: Make sure context processor is in settings.py

### Issue: No data appears
**Solution**: Run `python manage.py populate_homepage`

### Issue: Gradients don't work
**Solution**: Check Tailwind CSS is loaded in template

### Issue: Icons don't show
**Solution**: Verify FontAwesome CDN is loaded

### Issue: URL template tag fails
**Solution**: Use conditional logic shown above for URL vs string

---

**Last Updated**: 2026-01-27
