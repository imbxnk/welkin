<template>
  <div v-if="editor">
    <div class="wk-wysiwyg-menu">
      <button @click="editor.chain().focus().toggleBold().run()" tabindex="-1" class="wk-wysiwyg-btn" :class="{ 'is-active': editor.isActive('bold') }">
        <v-icon>mdi-format-bold</v-icon>
      </button>
      <button @click="editor.chain().focus().toggleItalic().run()" tabindex="-1" class="wk-wysiwyg-btn" :class="{ 'is-active': editor.isActive('italic') }">
        <v-icon>mdi-format-italic</v-icon>
      </button>
      <button @click="setLink" class="wk-wysiwyg-btn" tabindex="-1" :class="{ 'is-active': editor.isActive('link') }">
        <v-icon>mdi-link-variant</v-icon>
      </button>
      <button @click="editor.chain().focus().unsetLink().run()" tabindex="-1" class="wk-wysiwyg-btn" v-if="editor.isActive('link')">
        <v-icon>link-variant-off</v-icon>
      </button>
    </div>
    <editor-content :editor="editor" class="wk-wysiwyg-editor"/>
  </div>
</template>

<script>
import { Editor, EditorContent } from '@tiptap/vue-2'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Placeholder from '@tiptap/extension-placeholder'
import StarterKit from '@tiptap/starter-kit'
import Text from '@tiptap/extension-text'
import Link from '@tiptap/extension-link'
import Bold from '@tiptap/extension-bold'

export default {
  props: {
    value: {
      type: String,
      default: '',
    },
  },

  components: {
    EditorContent,
  },

  data() {
    return {
      editor: null,
    }
  },

  watch: {
    value(value) {
      // HTML
      const isSame = this.editor.getHTML() === value

      // JSON
      // const isSame = this.editor.getJSON().toString() === value.toString()

      if (isSame) {
        return
      }

      this.editor.commands.setContent(this.value, false)
    },
  },

  mounted() {
    this.editor = new Editor({
      extensions: [
        StarterKit,
        Document,
        Paragraph,
        Placeholder.configure({
          placeholder: "Content of the Announcement..."
        }),
        Text,
        Bold,
        Link,
      ],
      content: this.value,
      onUpdate: () => {
        // HTML
        this.$emit('input', this.editor.getHTML())

        // JSON
        // this.$emit('input', this.editor.getJSON())
      },
    })
  },

  methods: {
    setLink() {
      const url = window.prompt('URL')

      this.editor.chain().focus().setLink({ href: url }).run()
    },
  },

  beforeDestroy() {
    this.editor.destroy()
  },
}
</script>

<style lang="scss" scoped>
/* Basic editor styles */
::v-deep {
  .ProseMirror {
    > * + * {
      margin-top: 0.75em;
    }

    a {
      color: var(--primary);
    }
  }
  .ProseMirror p.is-editor-empty:first-child::before {
    content: attr(data-placeholder);
    float: left;
    color: #999;
    pointer-events: none;
    height: 0;
    font-weight: 500;
  }
}
</style>
