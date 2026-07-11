import { Typography, TypographyHeadingProps } from "heroui-native";


type AppHeadingProps = TypographyHeadingProps;

export default function AppHeading(props: AppHeadingProps) {
  return (
    <Typography.Heading {...props}/>
  )
}
