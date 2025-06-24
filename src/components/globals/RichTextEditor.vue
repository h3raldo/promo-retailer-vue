<script>
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import StarterKit from '@tiptap/starter-kit'
import { Editor, EditorContent } from '@tiptap/vue-3'

export default {
	components: {
		EditorContent,
	},
	data() {
		return {
			editor: null,
		}
	},
	props: {
		modelValue: {
			type: String,
			default: '',
		},
	},
	emits: ['update:modelValue'],
	watch: {
		modelValue(value) {
			const isSame = this.editor.getHTML() === value
			if (isSame) {
				return
			}
			this.editor.commands.setContent(value, false)
		},
	},
	methods: {
		setLink() {
			const previousUrl = this.editor.getAttributes('link').href
			const url = window.prompt('URL', previousUrl)

			// cancelled
			if (url === null) {
				return
			}

			// empty
			if (url === '') {
				this.editor
				  .chain()
				  .focus()
				  .extendMarkRange('link')
				  .unsetLink()
				  .run()

				return
			}

			// update link
			this.editor?.chain().focus().extendMarkRange('link').setLink({ href: url, target: null }).run()
		},
		addImage() {
			const url = window.prompt('URL')

			if (url) {
				this.editor.chain().focus().setImage({ src: url }).run()
			}
		}
	},

	mounted() {
		this.editor = new Editor({
			editorProps: {
				attributes: {
					class: 'form-control pr-editor-container',
				},
			},
			extensions: [
				StarterKit,
			  	Image.configure({
					inline: true
				}),
				TextAlign.configure({
					types: ['heading', 'paragraph'],
				}),
				Link.configure({
					openOnClick: false,
					defaultProtocol: 'https',
				}),
			],
			content: this.modelValue,
			onUpdate: () => {
				this.$emit('update:modelValue', this.editor.getHTML())
			},
		})
	},

	beforeUnmount() {
		this.editor?.destroy()
	},
}
</script>

<template>
	<div class="pr-editor">
		<div class="pr-editor__toolbar bg-light p-2 d-flex gap-2">
			<div class="btn-group">
				<button class="btn btn-sm btn-outline-secondary" @click="editor.chain().focus().toggleHeading({ level: 1 }).run()" :class="{ 'active': editor?.isActive('heading', { level: 1 }) }">
					<i class="bi bi-type-h1"></i>
				</button>
				<button class="btn btn-sm btn-outline-secondary" @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" :class="{ 'active': editor?.isActive('heading', { level: 2 }) }">
					<i class="bi bi-type-h2"></i>
				</button>
				<button class="btn btn-sm btn-outline-secondary" @click="editor.chain().focus().toggleHeading({ level: 3 }).run()" :class="{ 'active': editor?.isActive('heading', { level: 3 }) }">
					<i class="bi bi-type-h3"></i>
				</button>
			</div>

			<div class="btn-group">
				<button class="btn btn-sm btn-outline-secondary" @click="setLink" :class="{ 'active': editor?.isActive('link') }">
					<i class="bi bi-link"></i>
				</button>
				<button v-if="editor?.isActive('link')" class="btn btn-sm btn-outline-secondary" @click="editor?.chain().focus().unsetLink().run()" :disabled="!editor?.isActive('link')">
					Unset link
				</button>

				<button class="btn btn-sm btn-outline-secondary" @click="addImage">
					<i class="bi bi-image"></i>
				</button>
			</div>
			<div class="btn-group">
				<button class="btn btn-sm btn-outline-secondary" @click="editor.chain().focus().toggleBold().run()" :class="{ 'active': editor?.isActive('bold') }">
					<i class="bi bi-type-bold"></i>
				</button>
				<button class="btn btn-sm btn-outline-secondary" @click="editor.chain().focus().toggleItalic().run()" :class="{ 'active': editor?.isActive('italic') }">
					<i class="bi bi-type-italic"></i>
				</button>
				<button class="btn btn-sm btn-outline-secondary" @click="editor.chain().focus().toggleBulletList().run()" :class="{ 'active': editor?.isActive('bulletList') }">
					<i class="bi bi-list-ul"></i>
				</button>
			</div>
			<div class="btn-group">

				<button class="btn btn-sm btn-outline-secondary" @click="editor.chain().focus().setTextAlign('left').run()" :class="{ 'active': editor?.isActive({ textAlign: 'left' }) }">
					<i class="bi bi-justify-left"></i>
				</button>
				<button class="btn btn-sm btn-outline-secondary" @click="editor.chain().focus().setTextAlign('center').run()" :class="{ 'active': editor?.isActive({ textAlign: 'center' }) }">
					<i class="bi bi-justify"></i>
				</button>
				<button class="btn btn-sm btn-outline-secondary" @click="editor.chain().focus().setTextAlign('right').run()" :class="{ 'active': editor?.isActive({ textAlign: 'right' }) }">
					<i class="bi bi-justify-right"></i>
				</button>
			</div>
		</div>
		<EditorContent :editor="editor" />
	</div>
</template>

<style lang="scss">
.pr-editor-container{
	min-height: 300px;
}

/* Basic editor styles */
.tiptap {
	:first-child {
		margin-top: 0;
	}

	/* List styles */
	ul,
	ol {
		padding: 0 1rem;
		margin: 1.25rem 1rem 1.25rem 0.4rem;

		li p {
			margin-top: 0.25em;
			margin-bottom: 0.25em;
		}
	}

	/* Heading styles */
	h1,
	h2,
	h3,
	h4,
	h5,
	h6 {
		line-height: 1.1;
		margin-top: 2.5rem;
		text-wrap: pretty;
	}

	h1,
	h2 {
		margin-top: 3.5rem;
		margin-bottom: 1.5rem;
	}

	h1 {
		font-size: 1.4rem;
	}

	h2 {
		font-size: 1.2rem;
	}

	h3 {
		font-size: 1.1rem;
	}

	h4,
	h5,
	h6 {
		font-size: 1rem;
	}

	/* Code and preformatted text styles */
	code {
		background-color: var(--purple-light);
		border-radius: 0.4rem;
		color: var(--black);
		font-size: 0.85rem;
		padding: 0.25em 0.3em;
	}

	pre {
		background: var(--black);
		border-radius: 0.5rem;
		color: var(--white);
		font-family: 'JetBrainsMono', monospace;
		margin: 1.5rem 0;
		padding: 0.75rem 1rem;

		code {
			background: none;
			color: inherit;
			font-size: 0.8rem;
			padding: 0;
		}
	}

	blockquote {
		border-left: 3px solid var(--gray-3);
		margin: 1.5rem 0;
		padding-left: 1rem;
	}

	hr {
		border: none;
		border-top: 1px solid var(--gray-2);
		margin: 2rem 0;
	}
}
</style>