import React, { useState } from 'react';
import { Button } from '../../../shared/components/ui/Button';
import { Input } from '../../../shared/components/ui/Input';
import { Label } from '../../../shared/components/ui/Label';
import { Select, type SelectOption } from '../../../shared/components/ui/Select';
import { Textarea } from '../../../shared/components/ui/TextArea';

interface CreateCommunityFormProps {
  onClose: () => void;
}

type CommunityType = 'Public' | 'Private' | 'Restricted';

const communityTypeOptions: SelectOption[] = [
  { value: 'Public', label: 'Public' },
  { value: 'Private', label: 'Private' },
  { value: 'Restricted', label: 'Restricted' },
];

const CreateCommunityForm: React.FC<CreateCommunityFormProps> = ({ onClose }) => {
  const [communityName, setCommunityName] = useState('');
  const [description, setDescription] = useState('');
  const [communityType, setCommunityType] = useState<CommunityType>('Public');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log({ communityName, description, communityType });
    alert('Community creation form submitted! (Check console for values)');
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <div className="mb-4">
        <Label htmlFor="communityName">Community Name:</Label>
        <Input
          type="text"
          id="communityName"
          value={communityName}
          onChange={(e) => setCommunityName(e.target.value)}
          placeholder="e.g., r/MyAwesomeCommunity"
          required
        />
      </div>
      <div className="mb-4">
        <Label htmlFor="description">Description:</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="A brief description of your community"
          rows={4}
          required
        />
      </div>
      <div className="mb-6">
        <Label htmlFor="communityType">Community Type:</Label>
        <Select
          id="communityType"
          value={communityType}
          options={communityTypeOptions}
          onChange={(val) => setCommunityType(val as CommunityType)}
        />
      </div>
      <div className="flex items-center justify-between">
        <Button type="submit" variant="default">
          Create Community
        </Button>
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default CreateCommunityForm;
