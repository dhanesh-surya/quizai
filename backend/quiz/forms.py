from django import forms
from .models import SiteTheme


class ThemeCustomizationForm(forms.ModelForm):
    """Form for customizing website theme"""
    
    class Meta:
        model = SiteTheme
        fields = [
            'name',
            'is_active',
            # Background
            'background_type',
            'background_color_1',
            'background_color_2',
            'background_color_3',
            'background_image',
            'background_opacity',
            # Colors
            'primary_color',
            'secondary_color',
            'accent_color',
            'text_primary',
            'text_secondary',
            'text_muted',
            # Navbar
            'navbar_background',
            'navbar_text',
            'navbar_opacity',
            'navbar_blur',
            # Typography
            'font_family',
            'font_size_base',
            'font_size_heading',
            'line_height',
            # Cards
            'card_background_opacity',
            'card_border_opacity',
            'card_blur_amount',
            'card_shadow',
            # Buttons
            'button_style',
            'button_rounded',
            'button_shadow',
            # Animations
            'animation_speed',
            'enable_hover_effects',
            'enable_page_transitions',
            'enable_floating_orbs',
            'orb_opacity',
            # Advanced
            'custom_css',
        ]
        
        widgets = {
            'name': forms.TextInput(attrs={
                'class': 'w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white',
                'placeholder': 'e.g., Dark Blue Theme'
            }),
            
            # Background
            'background_type': forms.Select(attrs={
                'class': 'w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white'
            }),
            'background_color_1': forms.TextInput(attrs={
                'type': 'color',
                'class': 'w-full h-12 rounded-xl border border-white/20 cursor-pointer'
            }),
            'background_color_2': forms.TextInput(attrs={
                'type': 'color',
                'class': 'w-full h-12 rounded-xl border border-white/20 cursor-pointer'
            }),
            'background_color_3': forms.TextInput(attrs={
                'type': 'color',
                'class': 'w-full h-12 rounded-xl border border-white/20 cursor-pointer'
            }),
            'background_image': forms.FileInput(attrs={
                'class': 'w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white',
                'accept': 'image/*'
            }),
            'background_opacity': forms.NumberInput(attrs={
                'class': 'w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white',
                'min': '0',
                'max': '100',
                'step': '5'
            }),
            
            # Colors
            'primary_color': forms.TextInput(attrs={
                'type': 'color',
                'class': 'w-full h-12 rounded-xl border border-white/20 cursor-pointer'
            }),
            'secondary_color': forms.TextInput(attrs={
                'type': 'color',
                'class': 'w-full h-12 rounded-xl border border-white/20 cursor-pointer'
            }),
            'accent_color': forms.TextInput(attrs={
                'type': 'color',
                'class': 'w-full h-12 rounded-xl border border-white/20 cursor-pointer'
            }),
            'text_primary': forms.TextInput(attrs={
                'type': 'color',
                'class': 'w-full h-12 rounded-xl border border-white/20 cursor-pointer'
            }),
            'text_secondary': forms.TextInput(attrs={
                'type': 'color',
                'class': 'w-full h-12 rounded-xl border border-white/20 cursor-pointer'
            }),
            'text_muted': forms.TextInput(attrs={
                'type': 'color',
                'class': 'w-full h-12 rounded-xl border border-white/20 cursor-pointer'
            }),
            
            # Navbar
            'navbar_background': forms.TextInput(attrs={
                'type': 'color',
                'class': 'w-full h-12 rounded-xl border border-white/20 cursor-pointer'
            }),
            'navbar_text': forms.TextInput(attrs={
                'type': 'color',
                'class': 'w-full h-12 rounded-xl border border-white/20 cursor-pointer'
            }),
            'navbar_opacity': forms.NumberInput(attrs={
                'class': 'w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white',
                'min': '0',
                'max': '100',
                'step': '5'
            }),
            'navbar_blur': forms.CheckboxInput(attrs={
                'class': 'w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
            }),
            
            # Typography
            'font_family': forms.Select(attrs={
                'class': 'w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white'
            }),
            'font_size_base': forms.NumberInput(attrs={
                'class': 'w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white',
                'min': '12',
                'max': '24',
                'step': '1'
            }),
            'font_size_heading': forms.NumberInput(attrs={
                'class': 'w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white',
                'min': '24',
                'max': '64',
                'step': '2'
            }),
            'line_height': forms.NumberInput(attrs={
                'class': 'w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white',
                'min': '1.0',
                'max': '2.5',
                'step': '0.1'
            }),
            
            # Cards
            'card_background_opacity': forms.NumberInput(attrs={
                'class': 'w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white',
                'min': '0',
                'max': '100',
                'step': '5'
            }),
            'card_border_opacity': forms.NumberInput(attrs={
                'class': 'w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white',
                'min': '0',
                'max': '100',
                'step': '5'
            }),
            'card_blur_amount': forms.NumberInput(attrs={
                'class': 'w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white',
                'min': '0',
                'max': '32',
                'step': '2'
            }),
            'card_shadow': forms.CheckboxInput(attrs={
                'class': 'w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
            }),
            
            # Buttons
            'button_style': forms.Select(attrs={
                'class': 'w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white'
            }),
            'button_rounded': forms.NumberInput(attrs={
                'class': 'w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white',
                'min': '0',
                'max': '24',
                'step': '2'
            }),
            'button_shadow': forms.CheckboxInput(attrs={
                'class': 'w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
            }),
            
            # Animations
            'animation_speed': forms.Select(attrs={
                'class': 'w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white'
            }),
            'enable_hover_effects': forms.CheckboxInput(attrs={
                'class': 'w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
            }),
            'enable_page_transitions': forms.CheckboxInput(attrs={
                'class': 'w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
            }),
            'enable_floating_orbs': forms.CheckboxInput(attrs={
                'class': 'w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
            }),
            'orb_opacity': forms.NumberInput(attrs={
                'class': 'w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white',
                'min': '0',
                'max': '100',
                'step': '5'
            }),
            
            # Advanced
            'custom_css': forms.Textarea(attrs={
                'class': 'w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white font-mono',
                'rows': '10',
                'placeholder': '/* Add your custom CSS here */'
            }),
            
            'is_active': forms.CheckboxInput(attrs={
                'class': 'w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
            }),
        }
        
        labels = {
            'name': 'Theme Name',
            'is_active': 'Set as Active Theme',
            'background_type': 'Background Type',
            'background_color_1': 'Background Color 1',
            'background_color_2': 'Background Color 2 (Gradient)',
            'background_color_3': 'Background Color 3 (Gradient)',
            'background_image': 'Background Image',
            'background_opacity': 'Background Opacity (%)',
            'primary_color': 'Primary Brand Color',
            'secondary_color': 'Secondary Color',
            'accent_color': 'Accent Color',
            'text_primary': 'Primary Text Color',
            'text_secondary': 'Secondary Text Color',
            'text_muted': 'Muted Text Color',
            'navbar_background': 'Navbar Background',
            'navbar_text': 'Navbar Text Color',
            'navbar_opacity': 'Navbar Opacity (%)',
            'navbar_blur': 'Enable Navbar Blur (Glassmorphism)',
            'font_family': 'Font Family',
            'font_size_base': 'Base Font Size (px)',
            'font_size_heading': 'Heading Font Size (px)',
            'line_height': 'Line Height',
            'card_background_opacity': 'Card Background Opacity (%)',
            'card_border_opacity': 'Card Border Opacity (%)',
            'card_blur_amount': 'Card Blur Amount (px)',
            'card_shadow': 'Enable Card Shadows',
            'button_style': 'Button Style',
            'button_rounded': 'Button Border Radius (px)',
            'button_shadow': 'Enable Button Shadows',
            'animation_speed': 'Animation Speed',
            'enable_hover_effects': 'Enable Hover Effects',
            'enable_page_transitions': 'Enable Page Transitions',
            'enable_floating_orbs': 'Enable Floating Background Orbs',
            'orb_opacity': 'Orb Opacity (%)',
            'custom_css': 'Custom CSS (Advanced)',
        }
        
        help_texts = {
            'name': 'Give your theme a descriptive name',
            'is_active': 'Only one theme can be active at a time',
            'background_type': 'Choose how the background should appear',
            'custom_css': 'Add custom CSS code for advanced customization',
        }
    
    def clean(self):
        cleaned_data = super().clean()
        
        # Validate opacity values
        for field in ['background_opacity', 'navbar_opacity', 'card_background_opacity', 'card_border_opacity', 'orb_opacity']:
            value = cleaned_data.get(field)
            if value is not None and (value < 0 or value > 100):
                self.add_error(field, 'Value must be between 0 and 100')
        
        # Validate font sizes
        font_size_base = cleaned_data.get('font_size_base')
        if font_size_base and (font_size_base < 12 or font_size_base > 24):
            self.add_error('font_size_base', 'Base font size must be between 12 and 24 pixels')
        
        font_size_heading = cleaned_data.get('font_size_heading')
        if font_size_heading and (font_size_heading < 24 or font_size_heading > 64):
            self.add_error('font_size_heading', 'Heading font size must be between 24 and 64 pixels')
        
        return cleaned_data
