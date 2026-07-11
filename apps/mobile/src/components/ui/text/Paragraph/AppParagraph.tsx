import { Typography, TypographyParagraphProps } from 'heroui-native'
import React from 'react'

type AppParagraphProps = TypographyParagraphProps;

export default function AppParagraph(props: AppParagraphProps) {
  return (
    <Typography.Paragraph {...props}/>
  )
}
