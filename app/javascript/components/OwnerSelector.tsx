import { Autocomplete, TextField } from '@mui/material'
import React from 'react'
import useSelectedOwners from '../hooks/useSelectedOwners'
import { useOwnersIndex } from '../queries/user/owners'

const OwnerSelector = () => {
  const { selectedOwners, setSelectedOwners } = useSelectedOwners()
  const { data: owners } = useOwnersIndex()

  if (!owners) return null

  const ownerOptions = owners.map((owner) => ({ id: owner.handle, label: owner.handle })) ?? []

  return (
    <Autocomplete
      multiple
      value={selectedOwners.map((owner) => ownerOptions.find((item) => item.id === owner))}
      options={ownerOptions}
      renderInput={(params) => <TextField {...params} label="Filter by owners" />}
      onChange={(_event, items) => setSelectedOwners(items.flatMap((item) => (item ? item.id : [])))}
    />
  )
}

export default OwnerSelector