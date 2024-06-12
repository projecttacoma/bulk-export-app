import { Button, Center, Title } from '@mantine/core';

import classes from './page.module.css';

export default function Home() {
  return (
    <div>
      <Title className={classes.title}>bulk-export-app</Title>
      <Center className={classes.subtitle}>Build an interactive bulk-export query.</Center>
      <Center>
        <Button component="a" href="/query-selector">
          Continue to Query Builder
        </Button>
      </Center>
    </div>
  );
}
