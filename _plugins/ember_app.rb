module Jekyll
  class EmberAppTag < Liquid::Tag

    def initialize(tag_name, text, tokens)
      super
      @text = text.strip
    end

    def render(context)
      "<div id='#{@text}'></div>"
    end
  end
end

Liquid::Template.register_tag('ember_app', Jekyll::EmberAppTag)
