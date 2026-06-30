import {Box, Card, Grid, Stack, Text, TextInput} from '@sanity/ui'
import {randomKey} from '@sanity/util/content'
import type {Variant} from '@store/shared'
import {useCallback, useEffect, useMemo} from 'react'
import {set, unset, useFormValue} from 'sanity'

type ComboItem = {
  text: string
  coordinate: string
}

function cartesianProduct(data: ComboItem[][]): ComboItem[][] {
  return data.reduce<ComboItem[][]>(
    (accumulator, current) => accumulator.flatMap((d) => current.map((e) => [...d, e])),
    [[]],
  )
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

  const generatedCombinations = useMemo(() => {
    console.log('new combination')
    const validGroups = variants.filter(
      (group) => group.canChangePrice && group.variantName && group.values?.length > 0,
    )
    if (validGroups.length === 0) return []

    const attributeValues = validGroups.map((group, groupIndex) =>
      group.values.map((val, valueIndex) => ({
        text: val,
        coordinate: `${groupIndex}:${valueIndex}`, // i used coordinated as id
      })),
    )
    const rawCombos = cartesianProduct(attributeValues)

    const result = rawCombos.map((combo) => {
      const title = combo.map((c) => c.text).join(' / ')
      const id = combo.map((c) => `${c.text.toLowerCase()}-${c.coordinate}`).join('_')
      return {title, id}
    })

    console.log(result)

    return result
  }, [variants])

  const handleFieldChange = useCallback(
    (fieldName: 'price' | 'quantity' | string, fieldValue: string, _key: string) => {
      const numValue = fieldValue === '' ? 0 : Number(fieldValue)

      onChange(set(numValue, [{_key: _key}, fieldName]))
    },
    [onChange],
  )

  useEffect(() => {
    if (generatedCombinations.length === 0) {
      if (value && value.length > 0) {
        onChange(unset())
      }
      return
    }
    console.log('effect')

    const matchesPerfect =
      value.length === generatedCombinations.length &&
      generatedCombinations.every((combo) => value.some((item) => item.id === combo.id))

    if (!matchesPerfect) {
      const initializedValues = generatedCombinations.map((combo) => {
        const existingItem = value.find((item) => item.id === combo.id)

        return {
          _key: existingItem?._key || randomKey(12),
          id: combo.id,
          _type: 'object',
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
        const currentData = value.find((item) => item._key === combination.id)
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
                  value={currentData?.price}
                  onChange={(e) => {
                    e.currentTarget.value =
                      e.currentTarget.value.charAt(0) === '0'
                        ? e.currentTarget.value.slice(1)
                        : e.currentTarget.value
                    handleFieldChange('price', e.currentTarget.value, combination.id)
                  }}
                />
              </Box>
              <Box>
                <TextInput
                  type="number"
                  value={currentData?.quantity}
                  onChange={(e) => {
                    e.currentTarget.value =
                      e.currentTarget.value.charAt(0) === '0'
                        ? e.currentTarget.value.slice(1)
                        : e.currentTarget.value
                    handleFieldChange('quantity', e.currentTarget.value, combination.id)
                  }}
                />
              </Box>
            </Grid>
          </Card>
        )
      })}
    </Stack>
  )
}
