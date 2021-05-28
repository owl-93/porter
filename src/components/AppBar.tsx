import {useColorMode, useColorModeValue, Flex, Heading, IconButton, Image, Box, Circle} from '@chakra-ui/react'
import {SunIcon, MoonIcon} from '@chakra-ui/icons'
import logo from '../../src/assets/logo.svg'

interface AppBarProps {
    height?: number | string
}

const getAppBarHeight = (height: string | number | undefined): string => {
    return height ? (typeof height === "string" ? height : `${height}px`) : '64px'
}

export default function AppBar(props: AppBarProps) {
    const { toggleColorMode } = useColorMode()
    const headerBg = useColorModeValue("green.600", "purple.800")
    const colorModeIcon = useColorModeValue(<SunIcon/>, <MoonIcon/>)
    const logoColor = useColorModeValue("green.700", "purple.900")

    return (
        <Flex 
            w={"full"} 
            h={getAppBarHeight(props.height)} 
            bg={headerBg} 
            direction="row" 
            p={4}
            align="center">
            <Circle bg={logoColor} p={2} h="42px" w="42px">
                <Image src={logo}/>
            </Circle>
            <Box grow={1} w="full">
                <Heading ml={2}>Porter</Heading>
            </Box>
            <IconButton 
                icon={colorModeIcon} 
                variant={"ghost"}
                aria-label="color mode toggle" 
                onClick={toggleColorMode}
            />
        </Flex>
    )
}