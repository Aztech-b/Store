import {defineField, defineType} from 'sanity'
import {VariantMatrixInput} from '../components/VariantMatrixInput'

export const productType = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      type: 'string',
    }),
    defineField({
      name: 'category',
      type: 'string',
      options: {
        list: [
          {title: 'T-Shirt', value: 't-shirt'},
          {title: 'Accessories', value: 'accessories'},
          {title: 'Caps & Hats', value: 'hats'},
          {title: 'Sneakers', value: 'sneakers'},
        ],
        layout: 'dropdown',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      type: 'image',
      validation: (rule) => rule.required(),
    }),

    defineField({
      // I don't recommend changing anything here unless you know what you are doing.
      // Some values are hardcoded in VariantMatrixInput component and in frontend.
      name: 'variants',
      title: 'Product Variants',
      description:
        'Define the variants for this product (e.g., Attribute: "Color", Values: ["Blue", "Red"])',
      type: 'array',
      of: [
        {
          name: 'variant',
          type: 'object',
          fields: [
            {
              name: 'variantName',
              title: 'Variant Name',
              type: 'string',
              description: 'e.g., Size, Color, Gender',
            },
            {
              name: 'values',
              title: 'Values',
              type: 'array',
              of: [{type: 'string'}],
              options: {layout: 'tags'},
            },
            {
              name: 'canChangePrice',
              type: 'boolean',
            },
          ],
        },
      ],
    }),

    defineField({
      name: 'price',
      title: 'Price ($)',
      type: 'number',
      hidden: ({document}) => {
        // 🎯 Hide this field if the variants array has active items
        const hasVariants = Array.isArray(document?.variants) && document.variants.length > 0
        return hasVariants
      },
    }),

    defineField({
      name: 'variantPrices',
      title: 'Generated Variant Pricing & Stock',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'id', type: 'string'}, // e.g., "Blue / S / Male"
            {name: 'title', type: 'string'}, // e.g., "Blue / S / Male"
            {name: 'price', type: 'number', validation: (rule) => rule.required(), initialValue: 0},
            {
              name: 'quantity',
              type: 'number',
              validation: (rule) => rule.required(),
              initialValue: 0,
            },
          ],
        },
      ],
      components: {
        input: VariantMatrixInput,
      },
      hidden: ({document}) => {
        const hasVariants = Array.isArray(document?.variants) && document.variants.length > 0
        return !hasVariants
      },
    }),
  ],
})
