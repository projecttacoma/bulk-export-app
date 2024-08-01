import { Tooltip, Grid, Title, Group, Badge, GridCol } from '@mantine/core';
import { mandatoryElements } from 'fhir-spec-tools/build/data/mandatoryElements';

export interface MandatoryElementListProps {
  resourceType: string;
}

/*
 * Component for displaying the mandatory elements that are exported on a given resourceType
 */
export function MandatoryElementList({ resourceType }: MandatoryElementListProps) {
  const noMandatoryElements = mandatoryElements[resourceType].length === 0;

  return (
    <Tooltip
      label="Mandatory elements will always be exported from the server"
      disabled={noMandatoryElements}
      withArrow
      openDelay={1000}
      position="top"
    >
      <Grid align="center" bg="white">
        <GridCol span="content">
          <Title order={4} fw={600}>
            Mandatory Elements:
          </Title>
        </GridCol>
        <GridCol span={'auto'}>
          <Group>
            {mandatoryElements[resourceType].map(element => (
              <Badge key={element} size="md">
                {element}
              </Badge>
            ))}
            {noMandatoryElements && 'There are no mandatory elements on this resource type.'}
          </Group>
        </GridCol>
      </Grid>
    </Tooltip>
  );
}
