const handleApiError = (err) => {
  if (err.response.data.errors) {
    const errors = err.response.data.errors;
    errors.forEach((element) => {
      alert(element.msg);
    });
  } else {
    console.log(err);
  }
};

export default handleApiError;