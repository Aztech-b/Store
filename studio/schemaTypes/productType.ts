import {defineField, defineType} from 'sanity'

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
      validation: (rule) => rule.required(),
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
      name: 'price',
      type: 'number',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'customOptions',
      title: 'Product Options / Variants',
      description: 'Add custom options for this product (e.g., Size, Color, Fabric, Fit)',
      type: 'array',
      of: [
        defineField({
          name: 'optionGroup',
          title: 'Option Group',
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Option Name',
              type: 'string',
              description: 'e.g., Size, Color, Material',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'values',
              title: 'Allowed Values',
              type: 'array',
              description: 'Type a value and press Enter (e.g., "XS", "S", "M" or "100% Cotton")',
              of: [{type: 'string'}],
              options: {
                layout: 'tags', // This turns their inputs into clean visual tags automatically
              },
              validation: (rule) => rule.required().min(1),
            }),
          ],
          // This preview block makes it look clean inside the Sanity Studio dashboard list
          //   preview: {
          //     select: {
          //       title: 'title',
          //       subtitle: 'values',
          //     },
          //     prepare({title, subtitle}) {
          //       return {
          //         title: title,
          //         subtitle: subtitle ? subtitle.join(', ') : 'No values added yet',
          //       }
          //     },
          //   },
        }),
      ],
    }),
  ],
})
