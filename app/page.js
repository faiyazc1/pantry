'use client';
import { Box, Stack, Typography, Modal, TextField, Button } from '@mui/material';
import { firestore } from "./firebase";
import { collection, doc, getDoc, getDocs, setDoc, deleteDoc } from 'firebase/firestore';
import { useState, useEffect } from 'react';

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const updateInventory = async () => {
    const snapshot = await getDocs(collection(firestore, 'inventory'));
    const inventoryList = [];
    snapshot.forEach(doc => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
  };

  const addItem = async (item) => {
    const docRef = doc(firestore, 'inventory', item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(firestore, 'inventory', item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box 
      width="100vw" 
      height="100vh" 
      display={"flex"} 
      justifyContent={"center"} 
      alignItems={"center"}
      flexDirection={"column"}
      bgcolor="linear-gradient(135deg, #1c1c1c, #333)"
      gap={2}
    >
      <Box 
        width="800px"
        border={'2px solid rgba(0, 255, 127, 0.5)'} // Softer, semi-transparent border
        borderRadius={16} // Increased border radius for a modern look
        boxShadow="0px 4px 15px rgba(0, 0, 0, 0.5), 0px 1px 4px rgba(255, 255, 255, 0.1)" // Multi-layer shadow
        display={"flex"}
        flexDirection={"column"}
        padding={3}
        bgcolor="#262626"
        sx={{
          transition: 'all 0.3s ease-in-out', // Smooth transition for hover effects
          '&:hover': {
            transform: 'translateY(-5px)', // Slight lift on hover
            boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.7), 0px 2px 6px rgba(255, 255, 255, 0.2)', // Deeper shadow on hover
          },
        }}
      >
        <Box 
          width="100%" 
          display={"flex"} 
          justifyContent={"space-between"} 
          alignItems={"center"}
          paddingBottom={3}
        >
          <Typography 
            variant="h4"
            color="#00FF7F"
            fontWeight={5}
          >
            Pantry Items
          </Typography>
          <Button 
            variant="contained" 
            onClick={handleOpen}
            sx={{
              backgroundColor: '#1976d2',
              color: '#fff',
              borderRadius: 12, // Rounded corners for buttons
              padding: '10px 20px', // Larger padding for modern look
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                transform: 'scale(1.1)',
                backgroundColor: '#00FF7F',
                color: '#000',
                boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.3)',
              },
            }}
          >
            Add New Item
          </Button>
        </Box>

        <TextField
          variant="outlined"
          fullWidth
          placeholder="Find items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            marginBottom: 3,
            backgroundColor: "linear-gradient(135deg, #f0fff0, #98FB98)",
            borderRadius: 12,
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#A5D6A7',
              },
              '&:hover fieldset': {
                borderColor: '#00FF7F',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#00FF7F',
              },
              '& input': {
                color: '#A5D6A7',
              }
            },
            '& .MuiInputLabel-root': {
              color: '#A5D6A7',
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: '#00FF7F',
            },
          }}
        />

        <Modal   
          open={open}
          onClose={handleClose}
        >
          <Box 
            position="absolute"
            top="50%" 
            left="50%" 
            width={400}
            bgcolor="linear-gradient(135deg, #f0fff0, #98FB98)"
            border="2px solid #00FF7F"
            boxShadow={24}
            borderRadius={12}
            p={4}
            display="flex"
            flexDirection="column"
            gap={3}
            sx={{
              transform: "translate(-50%, -50%)",
              transition: 'all 0.3s ease-in-out',
            }}
          >
            <Typography variant="h4" color="#00FF7F">Add Item</Typography>
            <Stack width="100%" direction="row" spacing={2}>
              <TextField
                variant='outlined'
                fullWidth
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& input': {
                      color: '#00FF7F', // Green text color when typing
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#A5D6A7', // Placeholder color
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#00FF7F', // Label color when focused
                  },
                }}
              />
              <Button
                variant="outlined"
                onClick={() => {
                  addItem(itemName);
                  setItemName('');
                  handleClose();
                }}
                sx={{
                  backgroundColor: '#1976d2',
                  color: '#fff',
                  borderRadius: 12,
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.1)',
                    backgroundColor: '#00FF7F',
                    color: '#000',
                    boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.3)',
                  },
                }}
              >
                Add
              </Button>
            </Stack>
          </Box>
        </Modal>

        <Stack 
          width="100%" 
          spacing={3}
          overflow="auto"
          padding={2}
        >
          {filteredInventory.map((item) => (
            <Box 
              key={item.name}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              bgcolor="linear-gradient(135deg, #2e7d32, #4caf50)"
              padding={2}
              borderRadius={12}
              boxShadow="0px 4px 10px rgba(0, 0, 0, 0.3)"
              sx={{
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-3px)', // Slight lift on hover
                  boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.4)',
                },
              }}
            >
              <Typography
                variant="h6"
                color="#00FF7F"
              >
                {item.name}: {item.quantity}
              </Typography>
              <Box display="flex" gap={2}>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => removeItem(item.name)}
                  sx={{
                    backgroundColor: '#FF7043',
                    color: '#fff',
                    borderRadius: 12,
                    padding: '5px 15px',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.1)',
                      backgroundColor: '#FF7043',
                      borderColor: '#FF7043',
                      color: '#000',
                      boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.3)',
                    },
                  }}
                >
                  Remove
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => addItem(item.name)}
                  sx={{
                    backgroundColor: '#1976d2',
                    color: '#fff',
                    borderRadius: 12,
                    padding: '5px 15px',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.1)',
                      backgroundColor: '#1565c0',
                      borderColor: '#1565c0',
                      color: '#000',
                      boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.3)',
                    },
                  }}
                >
                  Add
                </Button>
              </Box>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}