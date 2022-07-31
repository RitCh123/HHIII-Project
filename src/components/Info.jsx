import React, {useState} from 'react';

import { LinkBox, LinkOverlay, Stack, Box, Heading, Text, Button } from '@chakra-ui/react'


export default function Info(props) {
  return (
    <LinkBox as='article' maxW='500px' p='5' borderWidth='1px' rounded='md'>
      <Box as='time' dateTime='2021-01-15 15:30:00 +0000 UTC'>
        Updated Today
      </Box>
      <Heading size='md' my='2'>
        <LinkOverlay href='#'>
          {props.title}
        </LinkOverlay>
      </Heading>
      <Stack spacing={8} direction="column">
        <Text>
          {props.description}
        </Text>
        <Text>
          <b>Address:</b> {props.address}
        </Text>
        <Button colorScheme="red">More Info</Button>
      </Stack>  
      
    </LinkBox>
  )
}
