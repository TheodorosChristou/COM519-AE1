const handleDelete = async (id) => {
    console.log(id);

    await fetch('/api/delete_recipe', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
          },
        body: JSON.stringify({id: id})
    })
  };

  
