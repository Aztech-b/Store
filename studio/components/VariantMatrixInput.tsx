import {Box, Card, Grid, Stack, Text, TextInput} from '@sanity/ui'
import {randomKey} from '@sanity/util/content'
import type {Variant} from '@store/shared'
import {useCallback, useEffect, useMemo} from 'react'
import {set, unset, useFormValue} from 'sanity'

function cartesianProduct(arrays: string[][]): string[][] {
  return arrays.reduce<string[][]>((a, b) => a.flatMap((d) => b.map((e) => [d, e].flat())), [[]])
}

export function VariantMatrixInput(props: any) {
  const {
    onChange,
    value = [],
  }: {
    onChange: any
    value: {id: string; title: string; price: number; quantity: number; _key: string}[]
  } = props
  const EMPTY_VARIANTS_ARRAY: Variant[] = []
  const variants = (useFormValue(['variants']) as Variant[]) || EMPTY_VARIANTS_ARRAY
  console.log(value)

  const generatedCombinations = useMemo(() => {
    const validGroups = variants.filter(
      (group) => group.canChangePrice && group.variantName && group.values?.length > 0,
    )
    if (validGroups.length === 0) return []

    const attributeValues = validGroups.map((group) => group.values)
    const rawCombos = cartesianProduct(attributeValues)

    const result = rawCombos.map((combo) => {
      const title = combo.join(' / ')
      const id = combo.join('-').toLowerCase().replace(/\s+/g, '')
      return {id, title}
    })

    return result
  }, [variants])

  const handleFieldChange = useCallback(
    (id: string, title: string, fieldName: 'price' | 'quantity' | string, fieldValue: string) => {
      const numValue = fieldValue === '' ? null : Number(fieldValue)

      const existingIndex = value.findIndex((item) => item.id === id)
      let nextValue = [...value] // created a MUTABLE copy of variable value

      if (existingIndex > -1) {
        nextValue[existingIndex] = {...nextValue[existingIndex], [fieldName]: numValue}
      } else {
        nextValue.push({id, title, [fieldName]: numValue})
      }

      nextValue = nextValue.filter((item) => generatedCombinations.some((c) => c.id === item.id))

      onChange(nextValue.length ? set(nextValue) : unset())
    },
    [onChange, value, generatedCombinations],
  )

  useEffect(() => {
    if (generatedCombinations.length === 0) {
      if (value && value.length > 0) {
        onChange(unset())
      }
      return
    }

    const matchesPerfect =
      value.length === generatedCombinations.length &&
      generatedCombinations.every((combo) => value.some((item) => item.id === combo.id))

    if (!matchesPerfect) {
      const initializedValues = generatedCombinations.map((combo) => {
        const existingItem = value.find((item) => item.id === combo.id)

        return {
          _key: existingItem?._key || randomKey(12),
          _type: 'object',
          id: combo.id,
          title: combo.title,
          price: existingItem?.price ?? 0,
          quantity: existingItem?.quantity ?? 0,
        }
      })

      onChange(set(initializedValues))
    }
  }, [generatedCombinations, onChange, value])

  if (generatedCombinations.length === 0) {
    return (
      <Card padding={3} tone="caution">
        <Text size={1}>Please add some Product Options above first to generate variants.</Text>
      </Card>
    )
  }

  return (
    <Stack gap={3}>
      <Card padding={2} borderBottom>
        <Grid gridTemplateColumns={[5, 5, 6]} gap={2}>
          <Box gridColumnStart={1} gridColumnEnd={3}>
            <Text weight="bold" size={1}>
              Variant Combination
            </Text>
          </Box>
          <Box>
            <Text weight="bold" size={1}>
              Price ($)
            </Text>
          </Box>
          <Box>
            <Text weight="bold" size={1}>
              Stock Quantity
            </Text>
          </Box>
        </Grid>
      </Card>

      {generatedCombinations.map((combination) => {
        const currentData = value.find((item) => item.id === combination.id) || {}
        return (
          <Card key={combination.id} padding={2} border>
            <Grid gridTemplateColumns={[5, 5, 6]} gap={2}>
              <Box gridColumnStart={1} gridColumnEnd={3}>
                <Text size={1} weight="medium">
                  {combination.title}
                </Text>
              </Box>
              <Box>
                <TextInput
                  type="number"
                  //   placeholder="0.00"
                  //   defaultValue={0}
                  value={currentData.price ?? ''}
                  onChange={(e) =>
                    handleFieldChange(
                      combination.id,
                      combination.title,
                      'price',
                      e.currentTarget.value,
                    )
                  }
                />
              </Box>
              <Box>
                <TextInput
                  type="number"
                  placeholder="0"
                  value={currentData.quantity ?? ''}
                  onChange={(e) =>
                    handleFieldChange(
                      combination.id,
                      combination.title,
                      'quantity',
                      e.currentTarget.value,
                    )
                  }
                />
              </Box>
            </Grid>
          </Card>
        )
      })}
    </Stack>
  )
}
