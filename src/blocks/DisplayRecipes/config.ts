import type { Block } from 'payload'
import { linkGroup } from '../../fields/linkGroup'

export const DisplayRecipes: Block = {
  slug: 'displayRecipes',
  interfaceName: 'DisplayRecipesBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      required: true,
    },
    linkGroup({
      appearances: ['default', 'outline'],
      overrides: {
        maxRows: 1,
        name: 'button',
        label: 'Button',
      },
    }),
    {
      name: 'recipes',
      type: 'array',
      label: 'Recipes',
      minRows: 1,
      maxRows: 3,
      fields: [
        {
          name: 'recipe',
          type: 'relationship',
          relationTo: 'recipes',
          required: true,
          label: 'Recipe',
        },
      ],
    },
  ],
  labels: {
    plural: 'Display Recipes',
    singular: 'Display Recipes',
  },
}
