from django_components import Component, register

@register("feature_card")
class FeatureCard(Component):
    template_name = "feature_card/feature_card.html"
    
    def get_context_data(self, icon, title, description, gradient_from, gradient_to):
        return {
            "icon": icon,
            "title": title,
            "description": description,
            "gradient_from": gradient_from,
            "gradient_to": gradient_to,
        }
    
    class Media:
        css = "feature_card/feature_card.css"
