from .models import (
    SiteTheme, StatCard, Feature, Testimonial, 
    FooterSection, HeroSection, SectionHeading
)


def theme_context(request):
    """
    Context processor to make the active theme available in all templates
    """
    active_theme = SiteTheme.get_active_theme()
    return {
        'active_theme': active_theme
    }


def homepage_content(request):
    """
    Context processor to make homepage content available to all templates
    """
    return {
        'hero_section': HeroSection.get_hero(),
        'stats_cards': StatCard.objects.filter(is_active=True),
        'features': Feature.objects.filter(is_active=True),
        'testimonials': Testimonial.objects.filter(is_active=True),
        'footer_section': FooterSection.get_footer(),
        'section_headings': {
            'features': SectionHeading.get_heading('features'),
            'testimonials': SectionHeading.get_heading('testimonials'),
            'how_it_works': SectionHeading.get_heading('how_it_works'),
            'cta': SectionHeading.get_heading('cta'),
        }
    }

