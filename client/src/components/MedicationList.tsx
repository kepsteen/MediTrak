import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  BoxSelect,
  Droplet,
  HandCoins,
  Pill,
  Plus,
  Syringe,
  Tablets,
  Wind,
} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Medication } from '../../data';

type Props = {
  medications: Medication[];
  error: unknown;
};

export const MedicationIcon = ({ type }) => {
  switch (type) {
    case 'Injection':
      return <Syringe size={24} className="mr-2" />;
    case 'Tablet':
      return <Tablets size={24} className="mr-2" />;
    case 'Topical':
      return <HandCoins size={24} className="mr-2" />;
    case 'Liquid':
      return <Droplet size={24} className="mr-2" />;
    case 'Patch':
      return <BoxSelect size={24} className="mr-2" />;
    case 'Inhaler':
      return <Wind size={24} className="mr-2" />;
    case 'Capsule':
    default:
      return <Pill size={24} className="mr-2" />;
  }
};

export function MedicationList({ medications, error }: Props) {
  const [openStates, setOpenStates] = useState<boolean[]>(
    new Array(medications.length).fill(false)
  );
  const [isAllExpanded, setIsAllExpanded] = useState(false);

  function toggleCard(index: number) {
    setOpenStates((prevStates) => {
      const newStates = [...prevStates];
      newStates[index] = !newStates[index];
      return newStates;
    });
  }

  function toggleAll() {
    setIsAllExpanded(!isAllExpanded);
    setOpenStates(new Array(medications.length).fill(!isAllExpanded));
  }

  if (error) {
    return (
      <div>
        Error Loading Medications:{' '}
        {error instanceof Error ? error.message : 'Unknown Error'}
      </div>
    );
  }
  return (
    <>
      <section className="container pb-[40px] ">
        <div
          className={`flex flex-wrap gap-2 items-center justify-center ${
            medications.length !== 0 && 'min-[400px]:justify-between'
          }`}>
          <Link to="/medications/add">
            <Button size="md" className="bg-darkred">
              Add New Medication
              <span className="flex items-start ml-2">
                <Pill size={24} />
                <Plus size={18} />
              </span>
            </Button>
          </Link>
          {medications.length !== 0 && (
            <Button
              size="md"
              variant="outline"
              className="w-[6rem] my-2"
              onClick={toggleAll}>
              {isAllExpanded ? 'Close All' : 'Expand All'}
            </Button>
          )}
        </div>
        <ul className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
          {medications.map((medication, index) => (
            <li key={`${medication.name}${index}`}>
              <Collapsible
                open={openStates[index]}
                onOpenChange={() => toggleCard(index)}>
                <Card>
                  <CardHeader className="hover:bg-gray-200">
                    <CollapsibleTrigger>
                      <CardTitle className="flex items-center text-redblack">
                        <MedicationIcon type={medication.form} />
                        {medication.name}
                      </CardTitle>
                    </CollapsibleTrigger>
                    <CardDescription>
                      {medication.remaining < 10 &&
                        medication.remaining !== null &&
                        `Warning: ${medication.remaining} doses left`}
                    </CardDescription>
                  </CardHeader>
                  <CollapsibleContent className="collapsible-content">
                    <CardContent>
                      <p>
                        <b>Dosage: </b>
                        {`${medication.dosage} ${medication.form}`}
                      </p>
                      <p>
                        <b>Prescriber: </b>
                        {medication.prescriber}
                      </p>
                      <p>
                        <b>Doses Remaining: </b>
                        {medication.remaining}
                      </p>
                      <p>
                        <b>Notes: </b>
                        {medication.notes}
                      </p>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
