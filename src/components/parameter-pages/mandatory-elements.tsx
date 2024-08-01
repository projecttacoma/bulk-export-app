import { Tooltip, Grid, Title, Group, Badge } from '@mantine/core';
import { mandatoryElements } from 'fhir-spec-tools/build/data/mandatoryElements';

export default function MandatoryElementList({ resourceType }: { resourceType: string }) {
  const noMandatoryElements = mandatoryElements[resourceType].length === 0;

  return (
    <Tooltip
      label="Mandatory elements will always be exported from the server"
      disabled={noMandatoryElements}
      withArrow
      openDelay={1000}
      position="left"
    >
      <Grid align="center" bg="white">
        <Grid.Col span="content">
          <Title order={4} fw={600}>
            Mandatory Elements:
          </Title>
        </Grid.Col>
        <Grid.Col span={'auto'}>
          <Group>
            {mandatoryElements[resourceType].map(element => (
              <Badge key={element} size="md">
                {element}
              </Badge>
            ))}
            {noMandatoryElements && 'There are no mandatory elements on this resource type.'}
          </Group>
        </Grid.Col>
      </Grid>
    </Tooltip>
  );
}
