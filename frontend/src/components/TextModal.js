import * as React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AuthContext from '../auth' 
import { useContext } from 'react';
import Modal from '@mui/material/Modal';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

const errorModalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function TextModal() {
  const { auth } = useContext(AuthContext);

  return (
    <div>
        <Modal
            open={Boolean(auth.modalText)}

            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={errorModalStyle}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Error
                </Typography>
                <Stack sx={{ width: '100%' }} spacing={2}>
                    <Alert severity="error">{auth.modalText}</Alert>
                    <Button onClick={auth.closeModal}>OK</Button>
                </Stack>
            </Box>
        </Modal>
    </div>
  );
}