from django.core.management.base import BaseCommand
from quiz.models import (
    StatCard, Feature, Testimonial, FooterSection, FooterLink, 
    HeroSection, SectionHeading
)


class Command(BaseCommand):
    help = 'Populate homepage with default content from existing landing.html'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.SUCCESS('=' * 60))
        self.stdout.write(self.style.SUCCESS('Populating Homepage Content...'))
        self.stdout.write(self.style.SUCCESS('=' * 60))

        # Create Stats
        self.stdout.write('\n📊 Creating Stats Cards...')
        stats_data = [
            {'title': '10K+', 'subtitle': 'Active Learners', 'order': 1},
            {'title': '50K+', 'subtitle': 'Quizzes Generated', 'order': 2},
            {'title': '95%', 'subtitle': 'Success Rate', 'order': 3},
            {'title': '4.9/5', 'subtitle': 'User Rating', 'order': 4},
        ]
        
        for stat_data in stats_data:
            stat, created = StatCard.objects.get_or_create(
                title=stat_data['title'],
                defaults=stat_data
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'  ✓ Created: {stat.title} - {stat.subtitle}'))
            else:
                self.stdout.write(f'  - Already exists: {stat.title}')

        # Create Features
        self.stdout.write('\n⚡ Creating Features...')
        features_data = [
            {
                'title': 'AI-Powered Generation',
                'description': 'Advanced AI creates personalized quizzes tailored to your learning level and goals.',
                'icon': 'fa-robot',
                'icon_gradient': 'from-blue-500 to-purple-600',
                'order': 1
           },
            {
                'title': 'Progress Tracking',
                'description': 'Monitor your improvement with detailed analytics and performance insights.',
                'icon': 'fa-chart-line',
                'icon_gradient': 'from-purple-500 to-pink-600',
                'order': 2
            },
            {
                'title': 'Earn Certificates',
                'description': 'Get certified for your achievements and showcase your knowledge.',
                'icon': 'fa-certificate',
                'icon_gradient': 'from-pink-500 to-red-600',
                'order': 3
            },
            {
                'title': 'Instant Feedback',
                'description': 'Receive immediate explanations and learn from your mistakes in real-time.',
                'icon': 'fa-clock',
                'icon_gradient': 'from-blue-500 to-cyan-500',
                'order': 4
            },
            {
                'title': 'Unlimited Topics',
                'description': 'Generate quizzes on any subject - from science to history to programming.',
                'icon': 'fa-infinity',
                'icon_gradient': 'from-green-500 to-emerald-600',
                'order': 5
            },
            {
                'title': 'Mobile Friendly',
                'description': 'Learn anywhere, anytime with our fully responsive design.',
                'icon': 'fa-mobile-alt',
                'icon_gradient': 'from-yellow-500 to-orange-600',
                'order': 6
            },
        ]
        
        for feature_data in features_data:
            feature, created = Feature.objects.get_or_create(
                title=feature_data['title'],
                defaults=feature_data
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'  ✓ Created: {feature.title}'))
            else:
                self.stdout.write(f'  - Already exists: {feature.title}')

        # Create Testimonials
        self.stdout.write('\n💬 Creating Testimonials...')
        testimonials_data = [
            {
                'name': 'Sarah Johnson',
                'role': 'Medical Student',
                'testimonial': 'MindSpark AI has revolutionized my study routine. The AI-generated quizzes are incredibly relevant and help me retain information better.',
                'rating': 5,
                'avatar_letter': 'S',
                'avatar_gradient': 'from-indigo-500 to-purple-600',
                'order': 1
            },
            {
                'name': 'Michael Chen',
                'role': 'Software Developer',
                'testimonial': 'Perfect for learning new programming languages. The instant feedback and explanations are exactly what I needed.',
                'rating': 5,
                'avatar_letter': 'M',
                'avatar_gradient': 'from-purple-500 to-pink-600',
                'order': 2
            },
            {
                'name': 'Emily Rodriguez',
                'role': 'High School Teacher',
                'testimonial': 'I use MindSpark AI to create practice quizzes for my students. It saves me hours and the quality is outstanding!',
                'rating': 5,
                'avatar_letter': 'E',
                'avatar_gradient': 'from-pink-500 to-red-600',
                'order': 3
            },
        ]
        
        for testimonial_data in testimonials_data:
            testimonial, created = Testimonial.objects.get_or_create(
                name=testimonial_data['name'],
                defaults=testimonial_data
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'  ✓ Created: {testimonial.name} - {testimonial.role}'))
            else:
                self.stdout.write(f'  - Already exists: {testimonial.name}')

        # Create Hero Section
        self.stdout.write('\n🦸 Creating Hero Section...')
        hero = HeroSection.get_hero()
        self.stdout.write(self.style.SUCCESS(f'  ✓ Hero section ready: {hero.heading_line1}'))

        # Create Footer
        self.stdout.write('\n🔗 Creating Footer...')
        footer = FooterSection.get_footer()
        self.stdout.write(self.style.SUCCESS(f'  ✓ Footer ready: {footer.brand_name}'))

        # Create Footer Links
        footer_links_data = [
            {'column': 'product', 'text': 'Features', 'url': '#features', 'order': 1},
            {'column': 'product', 'text': 'How It Works', 'url': '#how-it-works', 'order': 2},
            {'column': 'product', 'text': 'Pricing', 'url': 'register', 'order': 3},
            {'column': 'company', 'text': 'About Us', 'url': '#', 'order': 1},
            {'column': 'company', 'text': 'Blog', 'url': '#', 'order': 2},
            {'column': 'company', 'text': 'Careers', 'url': '#', 'order': 3},
        ]
        
        for link_data in footer_links_data:
            link, created = FooterLink.objects.get_or_create(
                footer=footer,
                text=link_data['text'],
                defaults=link_data
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'  ✓ Created footer link: {link.column.title()} - {link.text}'))

        # Create Section Headings
        self.stdout.write('\n📝 Creating Section Headings...')
        sections = ['features', 'testimonials', 'how_it_works', 'cta']
        for section in sections:
            heading = SectionHeading.get_heading(section)
            self.stdout.write(self.style.SUCCESS(f'  ✓ Section heading ready: {heading.section}'))

        self.stdout.write(self.style.SUCCESS('\n' + '=' * 60))
        self.stdout.write(self.style.SUCCESS('✨ Homepage content populated successfully!'))
        self.stdout.write(self.style.SUCCESS('=' * 60))
        self.stdout.write(self.style.WARNING('\n💡 You can now edit this content in Django Admin at:'))
        self.stdout.write(self.style.WARNING('   http://localhost:8001/admin/'))
        self.stdout.write('\n')
