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
      name: 'variantPrices',
      title: 'Generated Variant Pricing & Stock',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'id', type: 'string'}, // e.g., "blue-s-male"
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
        input: VariantMatrixInput, // 🎯 Custom interface magic happens here
      },
    }),

    // defineField({
    //   name: 'variants',
    //   title: 'Generated Combinations & Stock',
    //   description: 'Pair prices and quantities to any configuration',
    //   type: 'array',
    //   of: [
    //     {
    //       type: 'object',
    //       name: 'variantCombination',
    //       fields: [
    //         defineField({
    //           name: 'combinationOptions',
    //           title: 'Option Values for this Variant',
    //           description: 'Link the infinite dynamic options together for this specific object',
    //           type: 'array',
    //           of: [
    //             {
    //               type: 'object',
    //               name: 'optionKeyValue',
    //               fields: [
    //                 {name: 'key', title: 'Attribute (e.g., Color)', type: 'string'},
    //                 {name: 'value', title: 'Selected Value (e.g., Blue)', type: 'string'},
    //               ],
    //               // Makes it look neat inside the Sanity block inline list
    //               preview: {
    //                 select: {key: 'key', value: 'value'},
    //                 prepare: ({key, value}) => ({title: `${key}: ${value}`}),
    //               },
    //             },
    //           ],
    //         }),
    //         defineField({
    //           name: 'price',
    //           type: 'number',
    //           validation: (rule) => rule.required().min(0),
    //         }),
    //         defineField({
    //           name: 'quantity',
    //           title: 'Stock Qty',
    //           type: 'number',
    //           validation: (rule) => rule.required().min(0),
    //         }),
    //       ],
    //       preview: {
    //         select: {
    //           options: 'combinationOptions',
    //           price: 'price',
    //           qty: 'quantity',
    //         },
    //         prepare(selection) {
    //           const {options = [], price, qty} = selection
    //           // Format string into: "Color: Blue | Size: S | Gender: Male"
    //           const titleStr = options.map((opt: any) => `${opt.key}: ${opt.value}`).join(' | ')
    //           return {
    //             title: titleStr || 'New Variant combination',
    //             subtitle: `$${price || 0} — Stock: ${qty || 0}`,
    //           }
    //         },
    //       },
    //     },
    //   ],
    // }),

    // defineField({
    //   name: 'variant',
    //   title: 'Product Variants',
    //   type: 'array',
    //   of: [
    //     {
    //       name: 'variant',
    //       title: 'Variant Name',
    //       type: 'object',
    //       fields: [
    //         defineField({
    //           name: 'title',
    //           title: 'Variant Title',
    //           type: 'string',
    //           description: 'e.g. Black/White or S, M, L, XL etc. ',
    //           validation: (rule) => rule.min(1).required(),
    //         }),
    //         defineField({
    //           name: 'values',
    //           type: 'array',
    //           of: [
    //             defineField({
    //               name: 'value',
    //               type: 'object',
    //               fields: [
    //                 defineField({
    //                   name: 'value',
    //                   type: 'string',
    //                 }),
    //                 defineField({
    //                   name: 'price',
    //                   type: 'number',
    //                 }),
    //               ],
    //             }),
    //           ],
    //           options: {layout: 'tags'},
    //         }),
    //         // defineField({
    //         //   name: 'price',
    //         //   type: 'number',
    //         //   validation: (rule) => rule.min(0).required(),
    //         // }),
    //         // defineField({
    //         //   name: 'quantity',
    //         //   type: 'number',
    //         //   validation: (rule) => rule.required(),
    //         // }),
    //       ],
    //     },
    //   ],
    // }),

    // defineField({
    //   name: 'customOptions',
    //   title: 'Product Options / Variants',
    //   description: 'Add custom options for this product (e.g., Size, Color, Fabric, Fit)',
    //   type: 'array',
    //   of: [
    //     defineField({
    //       name: 'optionGroup',
    //       title: 'Option Group',
    //       type: 'object',
    //       fields: [
    //         defineField({
    //           name: 'title',
    //           title: 'Option Name',
    //           type: 'string',
    //           description: 'e.g., Size, Color, Material',
    //           validation: (rule) => rule.required(),
    //         }),
    //         defineField({
    //           name: 'values',
    //           title: 'Allowed Values',
    //           type: 'array',
    //           description: 'Type a value and press Enter (e.g., "XS", "S", "M" or "100% Cotton")',
    //           of: [{type: 'string'}],
    //           options: {
    //             layout: 'tags', // This turns their inputs into clean visual tags automatically
    //           },
    //           validation: (rule) => rule.required().min(1),
    //         }),
    //       ],
    //     }),
    //   ],
    // }),
  ],
})
