json_dt<-function(data,model){
  fit<-rpart(data,model)
  rules<-rpart.rules.table(fit)
  return (toJSON(rules))
}
