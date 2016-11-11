library(party)
get_ctree_parts <- function(x, ...)
{
  UseMethod("get_ctree_parts")
}

get_ctree_parts.BinaryTree <- function(x, ...)
{
  get_ctree_parts(attr(x, "tree"))
}

get_ctree_parts.SplittingNode <- function(x, ...)
{
  with(
    x,
    list(
      nodeID       = nodeID,
      variableName = psplit$variableName,
      splitPoint   = psplit$splitpoint,
      pValue       = 1 - round(criterion$maxcriterion, 3),
      statistic    = round(max(criterion$statistic), 3),
      left         = get_ctree_parts(x$left),
      right        = get_ctree_parts(x$right)
    )
  )
}

get_ctree_parts.TerminalNode <- function(x, ...)
{
  with(
    x,
    list(
      nodeID     = nodeID,
      weights    = sum(weights),
      prediction = prediction
    )
  )
}

json_dt<-function(model,data){
  data<-data.frame(data)
  library(grid)

  fit<-ctree(formula = model,data=data)
  useful_bits_of_fit <- get_ctree_parts(fit)
  return (useful_bits_of_fit)
}
