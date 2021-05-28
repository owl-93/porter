import React from 'react'
import {useColorModeValue, Flex, Center} from "@chakra-ui/react"

interface PortListHeaderProps {

}

export default function PortListHeader(props: PortListHeaderProps) {
    const bg = useColorModeValue("green.700", "purple.900")
    return (
        <Flex direction="row" w="full" bg={bg} px={4}>
            <Center px={2} flexBasis={"50%"}>Process</Center>
            <Center px={2} flexBasis={"50%"}>Ports</Center>
        </Flex>
    )
}