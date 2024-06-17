import { Button, Center, Title } from '@mantine/core';
import classes from './page.module.css';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Title className={classes.title}>bulk-export-app</Title>
      <Center className={classes.subtitle}>Build an interactive bulk-export query.</Center>
      <Center>
        <Button component={Link} href="/query-selector">
          Continue to Query Builder
        </Button>
      </Center>
    </>
  );
}
